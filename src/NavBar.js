import React, { useState, useEffect } from 'react';
import './style/Navbar.css';

export const Navbar = ({ activePage }) => {
    const [activeNav, setActiveNav] = useState(activePage);
    
    useEffect(() => {
        setActiveNav(activePage);
    }, [activePage]);
    
    return (
        <header className="generation-header">
            <div className="title">
                <h1>未命名情绪词典 <span className="subtitle">Uncharted Emotional Territories</span></h1>
            </div>
            <div className="nav-links">
                <a 
                    onClick={() => {
                        setActiveNav('gallery');
                        window.location.href = '/gallery';
                    }} 
                    className={`nav-link ${activeNav === 'gallery' ? 'active' : ''}`}
                    style={{cursor: 'pointer'}}
                >
                    浏览
                </a>
                <a 
                    onClick={() => {
                        setActiveNav('generation');
                        window.location.href = '/generation';
                    }} 
                    className={`nav-link ${activeNav === 'generation' ? 'active' : ''}`}
                    style={{cursor: 'pointer'}}
                >
                    生成新词
                </a>
            </div>
        </header>
    );
};