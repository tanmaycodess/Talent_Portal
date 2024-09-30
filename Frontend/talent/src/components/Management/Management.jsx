import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import './Management.css'

const TalentManagementPage = () => {
    const [talents, setTalents] = useState([]);

    useEffect(() => {
        const fetchTalents = async () => {
            try {
                const response = await axios.get('https://talentapp-z4fuh7pe.b4a.run/api/talent');
                setTalents(response.data);
            } catch (error) {
                console.error('There was an error fetching the talents!', error);
            }
        };

        fetchTalents();
    }, []);

    const handleFeedbackChange = async (id, feedback) => {
        try {
            await axios.patch(`https://talentapp-z4fuh7pe.b4a.run/api/talent/${id}`, { feedback });
            setTalents((prevTalents) =>
                prevTalents.map((talent) =>
                    talent.id === id ? { ...talent, feedback } : talent
                )
            );
        } catch (error) {
            console.error('There was an error updating the feedback!', error);
        }
    };

    const handleDownloadResume = async (id) => {
        try {
            const response = await axios.get(`https://talentapp-z4fuh7pe.b4a.run/api/talent/resume/${id}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `resume_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('There was an error downloading the resume!', error);
        }
    };

    const getButtonClass = (status, feedback) => {
        return status === feedback ? 'active' : '';
    };

    return (
        <>
            <Navbar />
            <div className='mcontainer'>
                <h1 className='theading'>Talent Management</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Resume</th>
                            <th>Actions</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {talents.map((talent) => (
                            <tr key={talent.id}>
                                <td>{talent.name}</td>
                                <td>
                                    <button className='dbtn' onClick={() => handleDownloadResume(talent.id)}>Download Resume</button>
                                </td>
                                <td>
                                    <button
                                        className={`cbtn1 ${getButtonClass('selected', talent.feedback)}`}
                                        onClick={() => handleFeedbackChange(talent.id, 'selected')}
                                    >
                                        Select
                                    </button>
                                    <button
                                        className={`cbtn2 ${getButtonClass('rejected', talent.feedback)}`}
                                        onClick={() => handleFeedbackChange(talent.id, 'rejected')}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        className={`cbtn3 ${getButtonClass('blocked', talent.feedback)}`}
                                        onClick={() => handleFeedbackChange(talent.id, 'blocked')}
                                    >
                                        Block
                                    </button>
                                </td>
                                <td>
                                    <p>{talent.comment}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TalentManagementPage;
