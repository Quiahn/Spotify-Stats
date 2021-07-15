import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom';

export default function RecentlyPlayed({ recents }) {
    // The `path` lets us build <Route> paths that are
    // relative to the parent route, while the `url` lets
    // us build relative links.
    let { url } = useRouteMatch();
    let i = 1;
    if (recents === undefined) recents = {}
    return (
        <div>
            <h3>Recently Played:</h3>
            <div className="scrolling-wrapper">
                {recents.items !== undefined && recents.items.map((obj) => {
                    return (

                        <div key={i++} className="container-img-text-overlay ">
                            <Link to={`${url}/track/${obj.track.id}`} className="link-nodecor ">

                                <img
                                    className="w-100 p-1 img-black-gradient-overlay"
                                    src={obj.track.album.images[0].url}
                                    alt={obj.track.id}
                                />



                                {(obj.track.explicit) ? <h6 className="top-right-txt-overlay">explicit</h6> : null}
                                <h5 className="bottom-right-txt-overlay text-wrap">{obj.track.name}</h5>
                            </Link>
                        </div>

                    )
                })}
            </div>
        </div>
    )
}
//<Typography variant="h4" > Recents </Typography>
//parseInt(obj.played_at.replace(/[^0-9]/g, ""))

/**
 *
 * <div key={i++}>
                            <img
                                className="d-block w-100"
                                src={obj.track.album.images[0].url}
                                alt={obj.track.id}
                            />

                            <h3>{obj.track.name}</h3>
                            {obj.track.explicit && <p className="img-text-explicit">explicit</p>}
                        </div>
 */