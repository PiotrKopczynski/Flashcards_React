import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';

const DeleteFlashcard = () => {
    const location = useLocation();
    const { flashcard } = location.state;
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const handleDelete = async () => {
        if (!auth.isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }

        try {
            const response = await api.post('api/Flashcard/DeleteFlashcardConfirmed', {
                id: flashcard.flashcardId,
                deckId: flashcard.deckId
            });
            if (response.status === 200) {
                console.log("DeleteFlashcard response: ", response.data);
                navigate(`/details/${flashcard.flashcardId}`);
            }
        } catch (e) {
            console.log("Error in DeleteFlashcard:", e);
            if (e.isTokenRefreshError) {
                setAuth({ isLoggedIn: false });
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                navigate('/login');
            }
        }
    };

    const handleCancel = () => {
        navigate(`/details/${flashcard.flashcardId}`);
    };

    return (
        <div>
            <h1>Delete Flashcard</h1>
            <p>Are you sure you want to delete this flashcard?</p>
            <p>Question: {flashcard.question}</p>
            <p>Answer: {flashcard.answer}</p>
            <p>Notes: {flashcard.notes}</p>
            <button className="btn btn-danger mt-5 m-2" type="button" onClick={handleDelete}>Delete</button>
            <button className="btn btn-secondary mt-5 m-2" type="button" onClick={handleCancel}>Cancel</button>
        </div>
    );
};

export default DeleteFlashcard;
