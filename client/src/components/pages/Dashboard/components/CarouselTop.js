import React from 'react'
import { Carousel } from 'react-bootstrap'

export default function CarouselTop({ topArtist }) {


    if (!topArtist || !Object.keys(topArtist).length) topArtist = []

    let keyId = 1
    const carouselItems = topArtist.map(artist => {
        return (
            <Carousel.Item key={keyId++}>
                <div className="position-relative">
                    <div className="top-artist-div img-black-gradient-overlay" style={{ backgroundImage: "url(" + artist.images[0].url + ")" }} >
                    </div>
                    <img className="Absolute-Center mobileDisable3" src={artist.images[0].url} alt="" />
                </div>


                <Carousel.Caption >
                    <h4>#{keyId}</h4>
                    <h2>{artist.name}</h2>
                    <p> Total Followes: {artist.followers.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    <button className="btn btn-outline-success btn-sm">About Artist</button>
                </Carousel.Caption>
            </Carousel.Item >
        )
    })



    return (
        <div>
            <Carousel>
                {carouselItems}
            </Carousel>
        </div>
    )
}
