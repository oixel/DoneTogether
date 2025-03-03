// src/pages/SignOut.tsx
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {

    return (
        <div className="container">
            <p>You are now signed out.</p>
            <Link to="/">Back to Home</Link>
        </div>
    );
};

export default Home;