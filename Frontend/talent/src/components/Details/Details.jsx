import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import API_BASE_URL  from '../Config/config'; // Adjust the path based on file structure
import './Details.css';

const TalentFormPage = () => {
    const [talent, setTalent] = useState({
        name: '',
        technology: '',
        client: '',
        email: '',
        contactNo: '',
        feedback: '',
        blocked: '',
        source: '',
        linkedinProfile: '',
        comment: '',
        resume: null,
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTalent((prevTalent) => ({
            ...prevTalent,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setTalent((prevTalent) => ({
            ...prevTalent,
            resume: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in talent) {
            formData.append(key, talent[key]);
        }

        try {
            await axios.post(API_BASE_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage({ type: 'success', text: 'Talent details submitted successfully.' });

            // Clear form after submission
            setTalent({
                name: '',
                technology: '',
                client: '',
                email: '',
                contactNo: '',
                feedback: '',
                blocked: '',
                source: '',
                linkedinProfile: '',
                comment: '',
                resume: null,
            });
        } catch (error) {
            console.error('Error submitting talent details:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to submit talent details.',
            });
        }
    };

    return (
        <>
            <Navbar />
            <div className="form1-container">
                <h1 className="heading">Add New Talent</h1>
                <form className="form1" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={talent.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />
                    <select
                        name="technology"
                        value={talent.technology}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select Technology
                        </option>
                        <option value="" disabled>Select Technology</option>
                        <option value="SAP MM">SAP MM</option>
                        <option value="SAP PP">SAP PP</option>
                        <option value="SAP PPQM">SAP PPQM</option>
                        <option value="SAP SD">SAP SD</option>
                        <option value="SAP FICO">SAP FICO</option>
                        <option value="SAP FI">SAP FI</option>
                        <option value="SAP CO">SAP CO</option>
                        <option value="SAP ABAP">SAP ABAP</option>
                        <option value="SAP EWM">SAP EWM</option>
                        <option value="SAP WM">SAP WM</option>
                        <option value="SAP Vistex">SAP Vistex</option>
                        <option value="SAC Planning">SAC Planning</option>
                        <option value="SAC Datasphere">SAC Datasphere</option>
                        <option value="SAP Security">SAP Security</option>
                        <option value="SAP CRM Technical">SAP CRM Technical</option>
                        <option value="SAP CRM Functional">SAP CRM Functional</option>
                        <option value="SAP HCM">SAP HCM</option>
                        <option value="PowerBi">PowerBi</option>
                        <option value="PowerApp">PowerApp</option>
                        <option value="SAP Concur">SAP Concur</option>
                        <option value="Salesforce">Salesforce</option>
                        <option value="Salesforce CPQ">Salesforce CPQ</option>
                        {/* Add your technology options here */}
                    </select>
                    <input
                        type="text"
                        name="client"
                        value={talent.client}
                        onChange={handleChange}
                        placeholder="Client"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={talent.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="text"
                        name="contactNo"
                        value={talent.contactNo}
                        onChange={handleChange}
                        placeholder="Contact No"
                        required
                    />
                    <input
                        type="text"
                        name="source"
                        value={talent.source}
                        onChange={handleChange}
                        placeholder="Source"
                        required
                    />
                    <input
                        type="url"
                        name="linkedinProfile"
                        value={talent.linkedinProfile}
                        onChange={handleChange}
                        placeholder="LinkedIn Profile"
                    />
                    <input
                        type="file"
                        name="resume"
                        onChange={handleFileChange}
                    />
                    <button className="sbtn" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
};

export default TalentFormPage;
