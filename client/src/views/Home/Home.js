import React from 'react';
import { Link } from "react-router-dom";

function Home() {
    return(
        <div>
            This is where student code junk is going to go <br />
            <Link to={'/login'}>Click here if you are a teacher</Link>
        </div>
    )
}

export default Home;