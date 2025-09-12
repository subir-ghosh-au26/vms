import React from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-wrapper">
                <main className="main-content">{children}</main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;