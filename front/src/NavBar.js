import React from 'react'
import { NavLink } from 'react-router-dom';

export default function NavBar() {
    return (
        <>

            <li class="nav-item">
                <NavLink className="nav-link" to="/">Registration</NavLink>
            </li>

            <li class="nav-item">
                <NavLink className="nav-link" to="/login">Login</NavLink>
            </li>
        </>
    )
}
