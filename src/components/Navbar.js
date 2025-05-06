import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export const Navbar = () => {
    return (
        <header className="navbar">
            <div className="navbar-title">
                <h1>未命名情绪词典 <span className="navbar-subtitle">Uncharted Emotional Dictionaries</span></h1>
            </div>
            <div className="navbar-links">
                <NavLink to="/gallery" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}>浏览词典</NavLink>
                <NavLink to="/generation" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}>生成新词</NavLink>
            </div>
        </header>
    );
};

export default Navbar; 