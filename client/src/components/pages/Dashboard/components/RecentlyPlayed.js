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
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-baseline">
                <h3>Recently Played:</h3>
                <p className="link-nodecor" >See All</p>
            </div>

            <div className="scrolling-wrapper">
                {recents.items !== undefined && recents.items.map((obj) => {
                    return (

                        <div key={i++} className="container-img-text-overlay ">
                            <Link to={`${url}/track/${obj.track.id}`} className="link-nodecor ">

                                <img
                                    className="w-100 px-1 img-black-gradient-overlay"
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
