import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

export const AuthContext = React.createContext({
    accessToken: '',
    refreshToken: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { }
});

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingTime = adjExpirationTime - currentTime;
    return remainingTime;
};

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedExpDate = localStorage.getItem('expTime');

    const remainingTime = calculateRemainingTime(storedExpDate);

    if (remainingTime <= 60000) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expTime');

        return null;
    }

    return {
        accessToken: storedToken,
        refreshToken: storedRefreshToken,
        duration: remainingTime
    };
}

const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();
    let initialAccessToken;
    let initialRefreshToken;
    if (tokenData){
        initialAccessToken = tokenData.accessToken;
        initialRefreshToken = tokenData.refreshToken;
    }
    
    const [accessToken, setAccessToken] = useState(initialAccessToken);
    const [refreshToken, setRefreshToken] = useState(initialRefreshToken);

    const userIsLoggedIn = !!accessToken;

    const logoutHandler = useCallback(() => {
        setAccessToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expTime');
        
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);

    const loginHandler = (accessToken, refreshToken, expirationTime) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('expTime', expirationTime);

        const remainingTime = calculateRemainingTime(expirationTime);

        logoutTimer = setTimeout(logoutHandler, remainingTime);
    };

    useEffect(() => {
        if (tokenData){
            console.log(tokenData.duration);
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);

    const contextValue = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>;
};

export default AuthContextProvider;