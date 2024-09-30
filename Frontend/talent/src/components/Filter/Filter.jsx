import React, { useState } from 'react';
import axios from 'axios';
import './Filter.css';
import Navbar from '../Navbar/Navbar';

const FilterComponent = () => {
    const [technology, setTechnology] = useState('');
    const [comment, setComment] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to format date
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleFilter = async () => {
        setLoading(true);
        setError(null);

        try {
            // Construct query parameters
            const queryString = new URLSearchParams({ technology, comment }).toString();
            const response = await fetch(`https://talentapp-z4fuh7pe.b4a.run/filter?${queryString}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="filter-component">
                <h1>Filter Results</h1>
                <div>
                    <label htmlFor="technology">Technology:</label>
                    <input
                        type="text"
                        id="technology"
                        value={technology}
                        onChange={(e) => setTechnology(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="comment">Comment:</label>
                    <input
                        type="text"
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                <button onClick={handleFilter} disabled={loading}>
                    {loading ? 'Loading...' : 'Filter'}
                </button>

                {error && <div className="error">{error}</div>}

                <div className="results">
                    {results.length === 0 ? (
                        <p>No results found.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Technology</th>
                                    <th>Comment</th>
                                    <th>LinkedIn</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result, index) => (
                                    <tr key={index}>
                                        <td>{result.name}</td>
                                        <td>{result.technology}</td>
                                        <td>{result.comment}</td>
                                        <td>
                                            <a href={result.linkedinProfile} target="_blank" rel="noopener noreferrer">
                                                {result.linkedinProfile}
                                            </a>
                                        </td>
                                        <td>{formatDate(result.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default FilterComponent;
