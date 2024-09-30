import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Applicants.module.css'; // Import the CSS module

const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resumeDownloadUrl, setResumeDownloadUrl] = useState(null);
    const [jobs, setJobs] = useState({}); // State for jobs
    const [applicants, setApplicants] = useState({}); // State for applicants

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch('http://localhost:5000/applications');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Sort applications by createdAt in descending order
                const sortedApplications = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setApplications(sortedApplications);
                await fetchJobTitles(sortedApplications);
                await fetchApplicants(sortedApplications); // Fetch applicants with sorted applications data
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };


        const fetchJobTitles = async (applications) => {
            const jobIds = applications.map(app => app.jobId);
            const uniqueJobIds = [...new Set(jobIds)];

            try {
                const jobResponses = await Promise.all(
                    uniqueJobIds.map(jobId =>
                        fetch(`http://localhost:5000/api/jobs/${jobId}`)
                    )
                );

                const jobData = await Promise.all(jobResponses.map(res => res.json()));
                const jobMap = jobData.reduce((acc, job) => {
                    acc[job.jobId] = job.jobTitle;
                    return acc;
                }, {});

                setJobs(jobMap);
            } catch (error) {
                console.error('Error fetching job titles:', error);
            }
        };

        const fetchApplicants = async (applications) => {
            const applicantIds = applications.map(app => app.applicantId);
            const uniqueApplicantIds = [...new Set(applicantIds)];

            try {
                const applicantResponses = await Promise.all(
                    uniqueApplicantIds.map(applicantId =>
                        fetch(`http://localhost:5000/api/applicants/${applicantId}`)
                    )
                );

                const applicantData = await Promise.all(applicantResponses.map(res => res.json()));
                const applicantMap = applicantData.reduce((acc, applicant) => {
                    acc[applicant.applicantId] = applicant; // Correctly map using applicantId
                    return acc;
                }, {});

                console.log('Fetched applicants:', applicantMap); // Debug log
                setApplicants(applicantMap);
            } catch (error) {
                console.error('Error fetching applicants:', error);
            }
        };

        fetchApplications();
    }, []);

    useEffect(() => {
        if (resumeDownloadUrl) {
            window.open(resumeDownloadUrl, '_blank');
        }
    }, [resumeDownloadUrl]);

    const handleResumeDownload = (applicationId) => {
        const downloadUrl = `http://localhost:5000/applications/${applicationId}/resume`;
        setResumeDownloadUrl(downloadUrl);
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            const updatedApplication = await response.json();
            setApplications((prevApps) =>
                prevApps.map((app) =>
                    app.applicationId === applicationId ? updatedApplication.application : app
                )
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // or use date.toLocaleDateString() if you want only date
    };

    if (loading) {
        return <div className={styles.loading}>Loading applications...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    return (
        <>
            <Navbar />
            <div className={styles.applicationsList}>
                <h2>Applications List</h2>
                <table className={styles.applicationsTable}>
                    <thead>
                        <tr>
                            {/* <th>Applicant ID</th> */}
                            <th>Applicant Name</th> {/* Added Applicant Name header */}
                            {/* <th>Job ID</th> */}
                            <th>Job Title</th>
                            <th>Contact Number</th>
                            <th>Applied On</th>
                            <th>LinkedIn Profile</th>
                            <th>Status</th>
                            <th>Resume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application) => (
                            <tr key={application.applicantId}>
                                {/* <td>{application.applicantId}</td> */}
                                <td>{applicants[application.applicantId]?.name || 'N/A'}</td> {/* Display applicant name */}
                                {/* <td>{application.jobId}</td> */}
                                <td>{jobs[application.jobId] || 'N/A'}</td>
                                <td>{application.contactNumber}</td>
                                <td>{formatDate(application.createdAt)}</td>
                                <td>
                                    {application.linkedinProfile ? (
                                        <a href={application.linkedinProfile} target="_blank" rel="noopener noreferrer">
                                            LinkedIn
                                        </a>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td>
                                    <select
                                        value={application.status}
                                        onChange={(e) => handleStatusChange(application.applicationId, e.target.value)}
                                        className={styles.statusSelect}
                                    >
                                        <option value="under review">Under Review</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleResumeDownload(application.applicationId)}
                                        className={styles.downloadButton}
                                    >
                                        Download Resume
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ApplicationsList;
