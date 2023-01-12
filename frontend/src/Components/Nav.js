import React from 'react'; // ES6 js
import {Link} from 'react-router-dom';

function Nav() {
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark top">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navMainMenu" aria-controls="navMainMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div id="navMainMenu" className="navbar-collapse collapse">
                <div className="navbar-nav ml-auto">
                    <Link to='/' className="nav-item nav-link active">Home</Link>
                    <Link to='/library' className="nav-item nav-link">Library</Link>
                    <Link to='/dashboard' className="nav-item nav-link">Dashboard</Link>
                    <Link to='/update-profile' className="nav-item nav-link">Update-Profile</Link>
                    <Link to='/signup' className="nav-item nav-link">Signup</Link>
                    <Link to='/login' className="nav-item nav-link">Login</Link>
                    <Link to='/forgot-password' className="nav-item nav-link">Login</Link>
                </div>
            </div>
        </nav>
    );
}

export default Nav;