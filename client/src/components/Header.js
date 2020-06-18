import React from 'react';
import './Header.css'

function Header(props) {
    return(
        <div className="navBar">
            <div className="navItems">
                <h1> Welcome {props.user}! </h1>
                <input type='button' onClick={props.handleLogout} value="Logout" className='navItem'/>
            </div>
        </div>
    )
}

export default Header