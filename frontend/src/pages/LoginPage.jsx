import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { username, password });

            // IMPORTANT: Check if the user has the ADMIN role
            if (response.data.user.role !== 'ADMIN') {
                setError('Access Denied. Only admins can log in here.');
                return;
            }

            // Store the token and user info in localStorage
            localStorage.setItem('vms_token', response.data.token);
            localStorage.setItem('vms_user', JSON.stringify(response.data.user));

            // Redirect to the dashboard
            navigate('/');

        } catch (err) {
            setError('Invalid username or password.');
            console.error('Login failed', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Admin Dashboard Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;