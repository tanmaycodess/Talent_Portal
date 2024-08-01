import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import Navbar from '../Navbar/Navbar';

const commentOptions = [
    'Excellent candidate',
    'Needs improvement',
    'Suitable for future roles',
    'Not a good fit'
];

const TalentManagement = () => {
    const [talents, setTalents] = useState([]);
    const [selectedTalent, setSelectedTalent] = useState(null);
    const [formData, setFormData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTalents = async () => {
            try {
                const response = await axios.get('https://talent-portal.onrender.com/api/talent');
                setTalents(response.data);
            } catch (error) {
                console.error('Error fetching talents:', error);
            }
        };
        fetchTalents();
    }, []);

    const handleSelectChange = async (e) => {
        const selectedId = e.target.value;
        if (selectedId) {
            try {
                const response = await axios.get(`https://talent-portal.onrender.com/api/talent/${selectedId}`);
                setSelectedTalent(response.data);
                setFormData(response.data);
                setEditMode(false);
            } catch (error) {
                console.error('Error fetching talent details:', error);
            }
        }
    };

    const handleEditChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCommentChange = (e) => {
        setFormData({ ...formData, comment: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`https://talent-portal.onrender.com/api/talent/${formData.id}`, formData);
            setSelectedTalent(formData);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating talent details:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`https://talent-portal.onrender.com/api/talent/${formData.id}`);
            setSelectedTalent(null);
            setFormData({});
        } catch (error) {
            console.error('Error deleting talent:', error);
        }
    };

    const filteredTalents = talents.filter(talent =>
        talent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <div className="page-container">
                <h2 className="page-header">Talent Profile</h2>
                <div className="form-container">
                    <label className="talent-select-label">Select a Talent:</label>
                    <input
                        type="text"
                        placeholder="Search for a talent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="talent-search-input"
                    />
                    <select className="talent-select" onChange={handleSelectChange} value={selectedTalent ? selectedTalent.id : ''}>
                        <option value="" disabled>Select a talent</option>
                        {filteredTalents.map(talent => (
                            <option key={talent.id} value={talent.id}>
                                {talent.name}
                            </option>
                        ))}
                    </select>

                    {selectedTalent && (
                        <div>
                            {editMode ? (
                                <div>
                                    <h3>Edit Talent Details</h3>
                                    <form className="talent-form">
                                        <label className="talent-form-label">Name:</label>
                                        <input className="talent-form-input" type="text" name="name" value={formData.name} onChange={handleEditChange} />
                                        <label className="talent-form-label">Technology:</label>
                                        <input className="talent-form-input" type="text" name="technology" value={formData.technology} onChange={handleEditChange} />
                                        <label className="talent-form-label">Client:</label>
                                        <input className="talent-form-input" type="text" name="client" value={formData.client} onChange={handleEditChange} />
                                        <label className="talent-form-label">Email:</label>
                                        <input className="talent-form-input" type="email" name="email" value={formData.email} onChange={handleEditChange} />
                                        <label className="talent-form-label">Contact No:</label>
                                        <input className="talent-form-input" type="text" name="contactNo" value={formData.contactNo} onChange={handleEditChange} />
                                        <label className="talent-form-label">Comment:</label>
                                        <select className="talent-form-select" name="comment" value={formData.comment} onChange={handleCommentChange}>
                                            <option value="" disabled>Select a comment</option>
                                            {commentOptions.map(comment => (
                                                <option key={comment} value={comment}>
                                                    {comment}
                                                </option>
                                            ))}
                                        </select>
                                        <label className="talent-form-label">LinkedIn Profile</label>
                                        <input className="talent-form-input" type="text" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleEditChange} />
                                        <button className="submit-button" type="button" onClick={handleUpdate}>Update</button>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <h3>Talent Profile</h3>
                                    <table className="talent-profile-table">
                                        <tbody>
                                            <tr>
                                                <th>Name</th>
                                                <td>{selectedTalent.name}</td>
                                            </tr>
                                            <tr>
                                                <th>Technology</th>
                                                <td>{selectedTalent.technology}</td>
                                            </tr>
                                            <tr>
                                                <th>Client</th>
                                                <td>{selectedTalent.client}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td>{selectedTalent.email}</td>
                                            </tr>
                                            <tr>
                                                <th>Contact No</th>
                                                <td>{selectedTalent.contactNo}</td>
                                            </tr>
                                            <tr>
                                                <th>Comment</th>
                                                <td>{selectedTalent.comment}</td>
                                            </tr>
                                            <tr>
                                                <th>LinkedIn Profile</th>
                                                <td>
                                                    {selectedTalent.linkedinProfile ? (
                                                        <a href={selectedTalent.linkedinProfile} target="_blank" rel="noopener noreferrer">
                                                            {selectedTalent.linkedinProfile}
                                                        </a>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="talent-actions">
                                        <button className="submit-button" onClick={() => setEditMode(true)}>Edit</button>
                                        <button className="submit-button" onClick={handleDelete}>Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TalentManagement;
