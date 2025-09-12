import React from 'react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="app-footer">
            <p>&copy; {currentYear} BIPARD. All Rights Reserved. Developed by Subir Ghosh</p>
        </footer>
    );
};

export default Footer;