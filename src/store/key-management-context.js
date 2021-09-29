import React, { useState } from "react";

export const KeyContext = React.createContext({
    publicKey: '',
    privateKey: '',
    storeKeys: () => { },
    removeKeys: () => { }
});

const retrieveStoredKeys = () => {
    const storedPublicKey = localStorage.getItem('publicKey');
    const storedPrivateKey = localStorage.getItem('privateKey');

    return {
        publicKey: storedPublicKey,
        privateKey: storedPrivateKey,
    };
}

const KeyContextProvider = (props) => {
    const keyData = retrieveStoredKeys();
    let initialPublicKey;
    let initialPrivateKey;
    if (keyData) {
        initialPublicKey = keyData.publicKey;
        initialPrivateKey = keyData.privateKey;
    }

    const [publicKey, setPublicKey] = useState(initialPublicKey);
    const [privateKey, setPrivateKey] = useState(initialPrivateKey);

    const storeKeys = (publicKey, privateKey) => {
        setPublicKey(publicKey);
        setPrivateKey(privateKey);
        localStorage.setItem('publicKey', publicKey);
        localStorage.setItem('privateKey', privateKey);
    };

    const removeKeys = () => {
        setPublicKey(null);
        setPrivateKey(null);
        localStorage.removeItem('publicKey');
        localStorage.removeItem('privateKey');
    };

    const contextValue = {
        publicKey: publicKey,
        privateKey: privateKey,
        storeKeys: storeKeys,
        removeKeys: removeKeys
    }

    return <KeyContext.Provider value={contextValue}>
        {props.children}
    </KeyContext.Provider>;
};

export default KeyContextProvider;