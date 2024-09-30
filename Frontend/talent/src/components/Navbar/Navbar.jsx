import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import "./Navbar.css";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleToggle = () => {
        setMenuOpen(!menuOpen);
    };

    const handleClose = () => {
        setMenuOpen(false);
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        setMenuOpen(false);
        navigate('/login');
    };

    return (
        <header className="header">
            <nav className="nav container">
                <NavLink to="/home" className="nav__logo">
                    Talent Portal
                </NavLink>

                <div className={`nav__menu ${menuOpen ? 'active' : ''}`} id="nav-menu">
                    <ul className="nav__list">
                        <li className="nav__item">
                            <NavLink to="/home" className="nav__link" onClick={handleClose}>
                                Home
                            </NavLink>
                        </li>
                        <li className="nav__item">
                            <NavLink to="/details" className="nav__link" onClick={handleClose}>
                               Details
                            </NavLink>
                        </li>
                        <li className="nav__item">
                            <NavLink to="/management" className="nav__link" onClick={handleClose}>
                                Manage
                            </NavLink>
                        </li>
                        <li className="nav__item">
                            <NavLink to="/profile" className="nav__link" onClick={handleClose}>
                                Profile
                            </NavLink>
                        </li>
                        <li className="nav__item">
                            <NavLink to="/filter" className="nav__link" onClick={handleClose}>
                                Filter
                            </NavLink>
                        </li>
                        <li className="nav__item">
                            <NavLink to="/auth" className="nav__link" onClick={handleClose}>
                                User Management
                            </NavLink>
                        </li>

                        <li className="nav__item">
                            <NavLink to="/form" className="nav__link" onClick={handleClose}>
                               PostJobs
                            </NavLink>
                        </li>

                        <li className="nav__item">
                            <NavLink to="/applicants" className="nav__link" onClick={handleClose}>
                                Applicants
                            </NavLink>
                        </li>
                       
                        <li className="nav__item">
                            <button className="Logout-btn" onClick={handleLogout}>Log out</button>
                        </li>
                    </ul>
                    <div className="nav__close" id="nav-close" onClick={handleClose}>
                        <IoClose />
                    </div>
                </div>

                <div className="nav__toggle" id="nav-toggle" onClick={handleToggle}>
                    <IoMenu />
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
