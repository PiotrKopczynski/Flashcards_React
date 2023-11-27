import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';

const DeleteFlashcard = () => {
    const location = useLocation();
    const { flashcard, deck } = location.state || {};
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDeleteFlashcard = async () => {
        setLoading(true);
        try {
            const response = await api.delete(`api/Flashcard/DeleteFlashcard?id=${flashcard.flashcardId}`);
            if (response.status === 200) {
                // Flashcard deletion successful
                navigate(`/browseflashcards/${deck.deckId}`, { state: { deck } });
            }
        } catch (e) {
            console.error('Error deleting flashcard:', e);
            if (e.isTokenRefreshError) {
                // Handle token refresh error
                setAuth({ isLoggedIn: false });
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(`/browseflashcards/${deck.deckId}`, { state: { deck } });
    };

    useEffect(() => {
        if (!auth.isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }
    }, [auth, navigate]);

    return (
        <div>
            <h1>Delete Flashcard</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <p>Are you sure you want to delete the flashcard?</p>
                    <p>Question: {flashcard.question}</p>
                    <p>Answer: {flashcard.answer}</p>
                    <button className="btn btn-danger" onClick={handleDeleteFlashcard}>
                        Delete
                    </button>
                    <button className="btn btn-secondary mx-2" onClick={handleCancel}>
                        Cancel
                    </button>
                </>
            )}
        </div>
    );
};

export default DeleteFlashcard;
