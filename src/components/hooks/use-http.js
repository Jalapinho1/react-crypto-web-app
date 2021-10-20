import { useEffect, useState, useCallback, useRef } from 'react';

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true; // Will set it to true on mount ...
    return () => { mounted.current = false; }; // ... and to false on unmount
  }, []);

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : 'GET',
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ?
          (requestConfig.body instanceof FormData ? requestConfig.body : JSON.stringify(requestConfig.body))
          : null
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Could not create quote.');
      }

      let data;
      if (requestConfig.isBlobOperation) {
        data = await response.blob();
      }else{
        data = await response.json();
      }
    
      applyData(data, requestConfig.outputData);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    if (mounted.current) {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
    setIsLoading,
    setError
  };
};

export default useHttp;