import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setErrorMessage('');
            setLoading(true);
            const response = await axios.post(`http://localhost:5000/login`, { usernameOrEmail, password });

            if (response.status === 200 && response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/home');
            }
        } catch (error) {
            setErrorMessage('Your username/email and/or password are incorrect.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login-container'>
            <form onSubmit={handleSubmit} className='login-form'>
                <label htmlFor="usernameOrEmail" className='login-label'>Username or Email</label>
                <input
                    type="text"
                    id="usernameOrEmail"
                    placeholder='Enter your username or email'
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    required
                    className='login-input'
                />

                <label htmlFor="password" className='login-label'>Password</label>
                <input
                    type="password"
                    id='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='login-input'
                />

                <button type="submit" className='login-button' disabled={loading}>
                    {loading ? (
                        <div className='spinner'></div>
                    ) : 'Login'}
                </button>
                {errorMessage && <div className='error-message'>{errorMessage}</div>}
            </form>
        </div>
    );
}

export default Login;
