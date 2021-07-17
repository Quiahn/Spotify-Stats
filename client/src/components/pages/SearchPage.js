import React, { useState, useEffect } from 'react'

export default function Search({ api }) {
    const [spotifyApi, setSpotifyApi] = useState({})


    useEffect(() => {
        if (api) setSpotifyApi(api)
    }, [api])

    useEffect(() => {
        if (Object.keys(spotifyApi).length !== 0)
            spotifyApi.searchTracks('love').then((data) => {
                console.log(data);
            })
    }, [spotifyApi])
    const handleChange = (e) => {
        console.log(e.target.value)
    }

    return (
        <div className="d-flex flex-column p-3">
            <input className="css-search-input bg-white p-2" type="text" placeholder="Search" onChange={(e) => handleChange(e)}></input>
        </div>
    )
}
