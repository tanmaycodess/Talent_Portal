import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import './Home.css'; // Make sure to create this CSS file

const Home = () => {
    const [talents, setTalents] = useState([]);

    useEffect(() => {
        const fetchTalents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/talent');
                setTalents(response.data);
            } catch (error) {
                console.error('Error fetching talents:', error);
            }
        };
        fetchTalents();
    }, []);

    const filterTalentsByFeedback = (feedback) => talents.filter(talent => talent.feedback === feedback);

    const getTalentCount = (feedback) => filterTalentsByFeedback(feedback).length;

    return (
        <div className="home-container">
            <Navbar />
            <h2 className="page1-header">Talent Status Overview</h2>
            <div className="cards-container">
                <div className="card selected-card">
                    <h3>Selected ({getTalentCount('selected')})</h3>
                    <ul>
                        {filterTalentsByFeedback('selected').map(talent => (
                            <li key={talent._id}>
                                {talent.name} - <span style={{ color: 'blue' }}>{talent.comment}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card rejected-card">
                    <h3>Rejected ({getTalentCount('rejected')})</h3>
                    <ul>
                        {filterTalentsByFeedback('rejected').map(talent => (
                            <li key={talent._id}>
                                {talent.name} - <span style={{ color: 'blue' }}>{talent.comment}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card blocked-card">
                    <h3>Blocked ({getTalentCount('blocked')})</h3>
                    <ul>
                        {filterTalentsByFeedback('blocked').map(talent => (
                            <li key={talent._id}>
                                {talent.name} - <span style={{ color: 'blue' }}>{talent.comment}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;
