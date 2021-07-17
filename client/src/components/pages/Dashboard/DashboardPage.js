//React hooks/functions
import React from 'react'
import { useEffect, useState } from 'react'
//Components
import RecentlyPlayed from './components/RecentlyPlayed';
import AccountInfo from './components/AccountInfo';
import TrackPage from '../TrackPage';
import useAuth from "../../misc/auth/useAuth"
//Modules
import SpotifyWebApi from 'spotify-web-api-node'
import Cookies from 'universal-cookie';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import axios from 'axios';
//Style
import { Row, Col, Nav, Button, ButtonGroup } from 'react-bootstrap';



const spotifyApi = new SpotifyWebApi({
    clientId: process.env.REACT_APP_CLIENT_ID,
})

//intiliaze cookie
const cookies = new Cookies();

export default function DashboardPage({ setPage }) {

    const [data, setData] = useState({})
    const [recents, setRecents] = useState({})
    const [refreshToken, setRefreshToken] = useState()
    const [started, setStarted] = useState()
    const [expiresIn, setExpiresIn] = useState()
    let { path } = useRouteMatch();

    //cookies
    let code = cookies.get("code")
    let tokenFromCookie = cookies.get("token");


    //localStorage
    let usrDataFromLocal = localStorage.getItem("user")
    let usrRecentPlayed = localStorage.getItem("recent_played")

    if (tokenFromCookie !== undefined) code = undefined;
    const accessToken = useAuth(code)

    useEffect(() => {
        if (cookies.get("token") !== undefined) {
            spotifyApi.setAccessToken(cookies.get("token"));
            return;
        }
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);

    }, [accessToken])

    useEffect(() => {
        if (usrDataFromLocal !== null) {
            setData(JSON.parse(usrDataFromLocal))
            if (usrRecentPlayed !== null) {
                setRecents(JSON.parse(usrRecentPlayed))
            }
            return;
        } else {
            if (!accessToken) return;
            spotifyApi.getMe().then(res => {
                localStorage.setItem("user", JSON.stringify(res.body))
                setData(res.body)
            }, function (err) {
                console.error(err);
            })
            spotifyApi.getMyRecentlyPlayedTracks({
                limit: 20
            }).then(function (data) {
                localStorage.setItem("recent_played", JSON.stringify(data.body))
                setRecents(data.body)
            }, function (err) {
                console.log('Something went wrong!', err);
            });

        }

    }, [accessToken, usrDataFromLocal, usrRecentPlayed])

    //Refresh
    useEffect(() => {
        let refreshInter = null;
        const waitForCookiesLoad = setTimeout(() => {
            setExpiresIn(cookies.get("expires"))
            setRefreshToken(cookies.get("refresh"))
            setStarted(cookies.get("started"))
            if (!(expiresIn && refreshToken && started)) return
            let time = ((expiresIn - 60) - ((new Date().getSeconds() - (started)))) * 1000
            console.log("Time in seconds: " + time / 1000)
            time = (time < 1000) ? 1000 : time;
            refreshInter = setInterval(() => {
                axios.post(process.env.REACT_APP_SERVER_DOMAIN + '/refresh', {
                    refreshToken,
                }).then(res => {
                    cookies.set("refresh", res.data.refreshToken);
                    cookies.set('token', res.data.accessToken);
                    cookies.set('started', new Date().getSeconds());
                    clearInterval()
                }).catch((e) => {
                    cookies.remove("code");
                    cookies.remove("token");
                    cookies.remove("refresh");
                    cookies.remove("expires");
                    cookies.remove("started");
                    localStorage.clear()
                    window.location = '/'
                    console.log("Refresh error: " + e);
                })
                console.log("Time in seconds: " + started)
            }, time);
        }, 1000);
        return () => {
            clearInterval(refreshInter)
            clearTimeout(waitForCookiesLoad)
        }
    }, [refreshToken, expiresIn, started])


    return (
        <div className="">
            <Row>
                <Col xs={2} md={2} className="mobileDisable">

                    <div className="sticky-top">
                        <Nav className="flex-column marginTopScroll">
                            <ButtonGroup vertical>
                                <Button variant="outline-secondary">Account</Button>
                                <Button variant="outline-secondary">Account</Button>
                                <Button variant="outline-secondary">Account</Button>
                                <Button variant="outline-secondary">Account</Button>
                                <Button variant="outline-secondary">Account</Button>
                            </ButtonGroup>
                        </Nav>
                    </div>
                </Col>
                <Col >
                    <div className="main">
                        <Switch>
                            <Route path={`${path}/`} exact>
                                <AccountInfo data={data} />
                                <RecentlyPlayed recents={recents} />
                                <h3>fsdf</h3>
                            </Route>
                            <Route path={`${path}/track/:trackId`}>
                                <TrackPage api={spotifyApi} />
                            </Route>
                        </Switch>
                    </div>
                </Col>
            </Row>
            <div />
        </div>


    )
}
