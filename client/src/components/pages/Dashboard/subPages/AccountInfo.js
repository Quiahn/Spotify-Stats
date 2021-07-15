import React from 'react'
import DefaultProfileImage from '../../../icons/user.svg'


export default function AccountInfo({ data }) {
    let filter_enabled = null;
    let filter_locked = null;
    let total = null;
    let profileImage = DefaultProfileImage

    if (data === undefined || data === null) {
        data = null
        filter_enabled = null;
        filter_locked = null;
        total = null;
        profileImage = DefaultProfileImage
    }
    if (data.hasOwnProperty("images") && data.images.length > 0) {
        profileImage = data.images[0];
    }
    if (data.hasOwnProperty("explicit_content")) {
        filter_enabled = data.explicit_content.filter_enabled;
        filter_locked = data.explicit_content.filter_locked;
        total = data.followers.total;
    }

    return (
        <div className="sub_account_container">
            <figure>
                <img alt="" src={profileImage} className="profileImg" />
                <figcaption>{data.display_name}</figcaption>
            </figure>
            <div className="sub_account_main_info">
                <form>
                    <div>
                        <label htmlFor="username">Username: </label>
                        <p type="text" id="username"  >{data.display_name}</p>
                    </div>
                    <div>
                        <label htmlFor="type">Account Type: </label>
                        <p type="text" id="type" > {data.type}</p>
                    </div>
                    <div>
                        <label htmlFor="country">Country: </label>
                        <p type="text" id="country" >{data.country} </p>
                    </div>
                    <div>
                        <label htmlFor="email">Email: </label>
                        <p type="text" id="email" > {data.email}</p>
                    </div>
                    <div>
                        <label htmlFor="followers">Followers: </label>
                        <p type="text" id="followers">{total} </p>
                    </div>

                    <div>
                        <label htmlFor="id">User ID: </label>
                        <p type="text" id="id" > {data.id}</p>  </div>
                    <div>
                        <label htmlFor="filter_enabled">Filter Enabled: </label>
                        <p type="text" id="filter_enabled">{(filter_enabled) ? "Yes" : "No"} </p>
                    </div>
                    <div> <label htmlFor="filter_locked">Filter Locked: </label>
                        <p type="text" id="filter_locked" >{(filter_locked) ? "Yes" : "No"} </p>
                    </div>
                </form>
            </div>

        </div>
    )
}
