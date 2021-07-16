import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';


const cookies = new Cookies();

export default function useAuth(code) {

    const [accessToken, setAccessToken] = useState();
    // eslint-disable-next-line
    const [refreshToken, setRefreshToken] = useState();
    // eslint-disable-next-line
    const [expiresIn, setExpiresIn] = useState();



    //Refresh Access Token
    useEffect(() => {
        if (!refreshToken || !expiresIn) return
        //console.log((((expiresIn - 60) * 1000) - (Math.floor((Date.now()) - parseInt(cookies.get("started"))))) / 60000);
        const timeout = setInterval(() => {
            console.log("\t Refresh Request was sent");
            axios.post(process.env.REACT_APP_SERVER_DOMAIN + '/refresh', {
                refreshToken,
            }).then(res => {

                //Remove code from url
                setAccessToken(res.data.accessToken);
                setExpiresIn(res.data.expiresIn);
                cookies.set('token', res.data.accessToken);
                cookies.set('expires', res.data.expiresIn);
                cookies.set('started', Date.now());
            }).catch((e) => {
                //window.location = '/'
                console.log("Refresh error: " + e);
            })
        }, ((expiresIn - 60) * 1000) - (Math.floor(Date.now() - parseInt(cookies.get("started")))));
        return () => {
            clearInterval(timeout)
        }
    }, [refreshToken, expiresIn])

    //Login
    useEffect(() => {
        if (code === undefined) return;
        console.log("\t Login Request was sent");
        axios.post(process.env.REACT_APP_SERVER_DOMAIN + '/login', {
            code,
        }).then(res => {
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);
            cookies.set('token', res.data.accessToken);
            cookies.set('refresh', res.data.refreshToken);
            cookies.set('expires', res.data.expiresIn);
            cookies.set('started', Date.now());
            window.history.pushState({}, null, '/dashboard');
        }).catch((e) => {//redirect user to back to login page when token expires
            console.log("Login error: " + e);
        })
    }, [code])



    useEffect(() => {
        if (cookies.get("refresh") && cookies.get("expires") && cookies.get("token")) {
            console.log("Found the coookies!!");
            setAccessToken(cookies.get("token"));
            setExpiresIn(cookies.get("expires"));
            setRefreshToken(cookies.get("refresh"));
        }
    }, [])

    return accessToken; //Only lastst  for 3600/60mins/1h
}