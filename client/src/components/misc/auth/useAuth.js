import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    // eslint-disable-next-line
    const [refreshToken, setRefreshToken] = useState();
    // eslint-disable-next-line
    const [expiresIn, setExpiresIn] = useState();

    //Login
    useEffect(() => {
        if (code === undefined) return;
        axios.post(process.env.REACT_APP_SERVER_DOMAIN + '/login', {
            code,
        }).then(res => {
            setAccessToken(res.data.accessToken);
            setExpiresIn(res.data.expiresIn);
            setRefreshToken(res.data.refreshToken);
            window.history.pushState({}, null, '/');
        }).catch((e) => {//redirect user to back to login page when token expires
            console.log("Login error: " + e);
        })
    }, [code])


    //Refresh Access Token
    useEffect(() => {
        if (!refreshToken || !expiresIn) return
        const timeout = setInterval(() => {
            axios.post(process.env.REACT_APP_SERVER_DOMAIN + '/refresh', {
                refreshToken,
            }).then(res => {
                //Remove code from url
                setAccessToken(res.data.accessToken);
                setExpiresIn(res.data.expiresIn);
            }).catch((e) => {//redirect user to back to login page when token expires
                window.location = '/'
                console.log("Refresh error: " + e);
            })
        }, (expiresIn - 60) * 1000);

        return () => clearTimeout(timeout);

    }, [refreshToken, expiresIn])

    return accessToken; //Only lastst  for 3600/60mins/1h
}