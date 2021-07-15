//React hooks/functions
import React from 'react'
import { useEffect, useState } from 'react'
//Components
import RecentlyPlayed from './subPages/RecentlyPlayed';
import AccountInfo from './subPages/AccountInfo';
import TrackPage from '../TrackPage';
import useAuth from "../../misc/auth/useAuth"
//Modules
import SpotifyWebApi from 'spotify-web-api-node'
import Cookies from 'universal-cookie';
import { Switch, Route, useRouteMatch } from "react-router-dom";
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

    // The `path` lets us build <Route> paths that are
    // relative to the parent route, while the `url` lets
    // us build relative links.
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
        setPage("dashboard")
        // eslint-disable-next-line
        tokenFromCookie = cookies.get("token")
        if (tokenFromCookie !== undefined) {
            spotifyApi.setAccessToken(tokenFromCookie);
            return;
        }
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
        cookies.set("token", accessToken)

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
                                <TrackPage />
                            </Route>
                        </Switch>
                    </div>
                </Col>
            </Row>
            <div />
        </div>


    )
}
