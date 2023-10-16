import UserNotifications from "@/features/notifications/UserNotifications";
import "@assets/templates/navbar.css"
import {FaCircleUser} from "react-icons/fa6"
import {NavLink, useNavigate} from "react-router-dom";

import {useAppDispatch} from "@/redux/hooks";
import {toggleSidebar_action} from "@/features/sidebar/sidebarSlice";
import React from "react";


function Navbar() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        dispatch(toggleSidebar_action())
    }

    return (
        <header className="top-navbar">
            <div>
                <button
                    onClick={handleClick}
                    className="sidebar-toggle-btn">
                    <svg height="24" viewBox="0 0 24 24" width="24" focusable="false">
                        <path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"></path>
                    </svg>
                </button>
            </div>

            <div className="site-logo">
                <button className="ml-4" onClick={() => navigate('/')}>
                    <p className="font-bold text-3xl">Nexus</p>
                </button>
            </div>

            <div className="menu">
                {/* menu items here */}
            </div>

            <div className="user-controls">
                <div className="user-notification">
                    <UserNotifications/>
                </div>
                <NavLink to="/user" className="user-avatar">
                    <FaCircleUser/>
                </NavLink>
            </div>
        </header>
    )
}

export default Navbar