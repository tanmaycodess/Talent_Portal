import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import './Details.css'

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
            await axios.post('http://localhost:5000/api/talent', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Talent details submitted successfully');
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
            console.error('There was an error submitting the talent details!', error);
            alert(`Error submitting talent details: ${error.response?.data?.error || error.message}`);
        }
    };


    return (
        <>
        <Navbar/>

        <div className="form1-container">
            <h1 className="heading">Add New Talent</h1>
                <form className='form1' onSubmit={handleSubmit}>
                    <input type="text" name="name" value={talent.name} onChange={handleChange} placeholder="Name" required />
                    <input type="text" name="technology" value={talent.technology} onChange={handleChange} placeholder="Technology" required />
                    <input type="text" name="client" value={talent.client} onChange={handleChange} placeholder="Client" required />
                    <input type="email" name="email" value={talent.email} onChange={handleChange} placeholder="Email" required />
                    <input type="text" name="contactNo" value={talent.contactNo} onChange={handleChange} placeholder="Contact No" required />
                    <input type="text" name="source" value={talent.source} onChange={handleChange} placeholder="Source" required />
                    <input type="url" name="linkedinProfile" value={talent.linkedinProfile} onChange={handleChange} placeholder="LinkedIn Profile"  />
                    {/* <textarea name="comment" value={talent.comment} onChange={handleChange} placeholder="Comment" required></textarea> */}
                    <input type="file" name="resume" onChange={handleFileChange} />
                    <button className='sbtn' type="submit">Submit</button>
                </form>
        </div>
        

        </>
    );
};

export default TalentFormPage;
