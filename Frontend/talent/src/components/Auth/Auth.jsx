import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Auth.css'; // Ensure you create this CSS file
import Navbar from '../Navbar/Navbar'; // Adjust the import path if needed
import API_BASE_URL from '../Config/config'; // Import the config file

const App = () => {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`);
            setUsers(response.data);
            setUsers(Array.isArray(response.data) ? response.data : []);  // Ensure it's an array

        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
    };

    const addUser = async (user) => {
        try {
            await axios.post(`${API_BASE_URL}/users`, user);
            fetchUsers();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const updateUser = async (id, user) => {
        try {
            await axios.put(`${API_BASE_URL}/users/${id}`, user);
            fetchUsers();
            setEditUser(null);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="app-container">
                <h1>User Management</h1>
                <UserForm
                    onAddUser={addUser}
                    onUpdateUser={updateUser}
                    editUser={editUser}
                    setEditUser={setEditUser}
                />
                <UserList
                    users={users}
                    onDeleteUser={deleteUser}
                    onEditUser={setEditUser}
                />
            </div>
        </>
    );
};

const UserForm = ({ onAddUser, onUpdateUser, editUser, setEditUser }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (editUser) {
            setUsername(editUser.username);
            setEmail(editUser.email);
            setPassword(editUser.password);
        }
    }, [editUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editUser) {
            onUpdateUser(editUser._id, { username, email, password });
        } else {
            onAddUser({ username, email, password });
        }
        setUsername('');
        setEmail('');
        setPassword('');
        setEditUser(null);
    };

    return (
        <div className="user-form">
            <h2>{editUser ? 'Edit User' : 'Add User'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{editUser ? 'Update User' : 'Add User'}</button>
            </form>
        </div>
    );
};

const UserList = ({ users, onDeleteUser, onEditUser }) => (
    <div className="user-list">
        <h2>Users</h2>
        <table>
            <thead>
                <tr>
                    <th>UserId</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                        <td>{user.userId}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                            <button onClick={() => onEditUser(user)}>Edit</button>
                            <button onClick={() => onDeleteUser(user._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default App;
