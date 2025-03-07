// src/pages/Page404.tsx
import { Link } from 'react-router-dom'

const Page404 = () => {
    return (
        <div className="404">
            <p>Page not found.</p>
            <Link to='/'>Back to Home</Link>
        </div >
    );
};

export default Page404;