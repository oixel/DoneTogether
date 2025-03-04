import axios from 'axios';

import '../styles/User.css';

interface UserPropTypes {
    username: string;
    imageUrl: string;
}

function User({ username, imageUrl }: UserPropTypes) {
    return (
        <div className="userContainer">
            <img
                src={imageUrl}
                alt="Profile image"
                className="profilePicture"
                width={35}
            />
            <p>{username}</p>
        </div>
    );
}

export default User;