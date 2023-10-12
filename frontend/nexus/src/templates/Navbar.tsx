import UserNotifications from "@/features/notifications/UserNotifications";
import "@assets/templates/navbar.css"
import {FaCircleUser} from "react-icons/fa6"
import {NavLink} from "react-router-dom";

import {useAppDispatch} from "@/redux/hooks";
import {toggleSidebar_action} from "@/features/sidebar/sidebarSlice";
import {useState} from "react";


function Navbar() {

    const dispatch = useAppDispatch();

    function handleClick() {
        dispatch(toggleSidebar_action())
    }

    return (
        <header>
            <div className="top-navbar">
                <button
                    onClick={handleClick}
                    className="sidebar-toggle-btn">
                    <svg height="24" viewBox="0 0 24 24" width="24" focusable="false">
                        <path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"></path>
                    </svg>
                </button>

                <div className="site-logo">
                    <p className="font-bold text-3xl">Nexus</p>
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
            </div>
            <div>
                <button onClick={() => hideSidebar()}>hide</button>
            </div>
        </header>
    )
}

export default Navbar