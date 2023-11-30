import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';

const DetailFlashcard = () => {
    const location = useLocation();
    const { flashcard, deck } = location.state;
    const navigate = useNavigate();
    const { auth, logout} = useContext(AuthContext);


    const handleDeleteFlashcardButton = (flashcard, deck) => {
        navigate(`/deleteflashcard/${flashcard.flashcardId}`, { state: { flashcard, deck } });
    };

    const handleUpdateFlashcardButton = (flashcard, deck) => {
        navigate(`/updateflashcard/${flashcard.flashcardId}`, { state: { flashcard, deck } });
    };

    const handleBackToFlashcardsButton = (deck) => {
        navigate(`/browseflashcards/${deck.deckId}`, { state: { deck } });
    };

    useEffect(() => {
        if (!auth.isLoggedIn) {
            logout();
        }
    }, [auth, navigate]);

    return (
        <div>
            <h1>Flashcard Detail</h1>
            <div>
                <p>Question: {flashcard.question}</p>
                <p>Answer: {flashcard.answer}</p>
                <p>Notes: {flashcard.notes}</p>
                <button className="btn btn-danger mt-2" onClick={() => handleDeleteFlashcardButton(flashcard, deck)}>
                    Delete
                </button>
                <button className="btn btn-secondary mt-2 mx-1" onClick={() => handleUpdateFlashcardButton(flashcard, deck)}>
                    Update
                </button>
                <button className="btn btn-primary mt-2" onClick={() => handleBackToFlashcardsButton(deck)}>
                    Back to Flashcards
                </button>
            </div>
        </div>
    );
};

export default DetailFlashcard;