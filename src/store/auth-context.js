import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

export const AuthContext = React.createContext({
    username: '',
    accessToken: '',
    refreshToken: '',
    isLoggedIn: false,
    login: () => { },
    logout: () => { }
});

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingTime = adjExpirationTime - currentTime;
    return remainingTime;
};

const retrieveStoredToken = () => {
    const storedUsername = localStorage.getItem('username');
    const storedToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedExpDate = localStorage.getItem('expTime');

    const remainingTime = calculateRemainingTime(storedExpDate);

    if (remainingTime <= 60000) {
        localStorage.removeItem('username');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expTime');

        return null;
    }

    return {
        username: storedUsername,
        accessToken: storedToken,
        refreshToken: storedRefreshToken,
        duration: remainingTime
    };
}

const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();
    let initialUsername;
    let initialAccessToken;
    let initialRefreshToken;
    if (tokenData){
        initialUsername = tokenData.username;
        initialAccessToken = tokenData.accessToken;
        initialRefreshToken = tokenData.refreshToken;
    }
    
    const [username, setUsername] = useState(initialUsername);
    const [accessToken, setAccessToken] = useState(initialAccessToken);
    const [refreshToken, setRefreshToken] = useState(initialRefreshToken);

    const userIsLoggedIn = !!accessToken;

    const logoutHandler = useCallback(() => {
        setAccessToken(null);
        localStorage.removeItem('username');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expTime');
        
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);

    const loginHandler = (username, accessToken, refreshToken, expirationTime) => {
        setUsername(username);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem('username', username);
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
        username: username,
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