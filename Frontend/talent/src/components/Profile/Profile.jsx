import React, { useState, useEffect } from 'react';
import './Profile.css';
import Navbar from '../Navbar/Navbar';
import API_BASE_URL from '../Config/config'; // Import the API base URL

const commentOptions = [
    'Interested for Freelance',
    'Interested but presently not available can be contacted afterward',
    'Interested for fulltime',
    'Interested For fulltime remote work',
    'Resigned',
    'Can be contacted afterward',
    'Possesses strong technical skills but has room for improvement in communication',
    'Joined somewhere else',
    'Good but not in budget',
    'Good but not as per said experienced',
    'Technically not as per experience mentioned',
    'Other...'
];

const TalentManagement = () => {
    const [talents, setTalents] = useState([]);
    const [selectedTalent, setSelectedTalent] = useState(null);
    const [formData, setFormData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [customComment, setCustomComment] = useState('');

    useEffect(() => {
        const fetchTalents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/talent`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTalents(data);
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
                const response = await fetch(`${API_BASE_URL}/api/talent/${selectedId}`); // Use the imported API URL
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setSelectedTalent(data);
                setFormData(data);
                setCustomComment(data.comment === 'Other...' ? data.customComment : '');
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
        const value = e.target.value;
        if (value === 'Other...') {
            setFormData({ ...formData, comment: value });
            setCustomComment(formData.customComment || ''); // Set existing custom comment
        } else {
            setFormData({ ...formData, comment: value });
            setCustomComment(''); // Clear custom comment if any other option is selected
        }
    };

    const handleCustomCommentChange = (e) => {
        const value = e.target.value;
        setCustomComment(value);
        setFormData({ ...formData, customComment: value });
    };

    const handleUpdate = async () => {
        try {
            const updatedData = {
                ...formData,
                comment: formData.comment === 'Other...' ? 'Other...' : formData.comment,
                customComment: formData.comment === 'Other...' ? customComment : '',
            };

            const response = await fetch(`${API_BASE_URL}/api/talent/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setSelectedTalent(data);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating talent details:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/talent/${formData.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Network response was not ok');
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
                                    <form className="talent-form" onSubmit={(e) => e.preventDefault()}>
                                        <label className="talent-form-label">Name:</label>
                                        <input
                                            className="talent-form-input"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleEditChange}
                                        />
                                        <label className="talent-form-label">Technology:</label>
                                        <input
                                            className="talent-form-input"
                                            type="text"
                                            name="technology"
                                            value={formData.technology}
                                            onChange={handleEditChange}
                                        />
                                        <label className="talent-form-label">Client:</label>
                                        <input
                                            className="talent-form-input"
                                            type="text"
                                            name="client"
                                            value={formData.client}
                                            onChange={handleEditChange}
                                        />
                                        <label className="talent-form-label">Email:</label>
                                        <input
                                            className="talent-form-input"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleEditChange}
                                        />
                                        <label className="talent-form-label">Contact No:</label>
                                        <input
                                            className="talent-form-input"
                                            type="text"
                                            name="contactNo"
                                            value={formData.contactNo}
                                            onChange={handleEditChange}
                                        />
                                        <label className="talent-form-label">Comment:</label>
                                        <select
                                            className="talent-form-select"
                                            name="comment"
                                            value={formData.comment}
                                            onChange={handleCommentChange}
                                        >
                                            <option value="" disabled>Select a comment</option>
                                            {commentOptions.map(comment => (
                                                <option key={comment} value={comment}>
                                                    {comment}
                                                </option>
                                            ))}
                                        </select>
                                        {formData.comment === 'Other...' && (
                                            <input
                                                type="text"
                                                placeholder="Enter your comment"
                                                value={customComment}
                                                onChange={handleCustomCommentChange}
                                                className="custom-comment-input"
                                            />
                                        )}
                                        <button
                                            className="submit-button"
                                            type="button"
                                            onClick={handleUpdate}
                                        >
                                            Update
                                        </button>
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
                                    <button
                                        className="submit-button"
                                        onClick={() => setEditMode(true)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
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
