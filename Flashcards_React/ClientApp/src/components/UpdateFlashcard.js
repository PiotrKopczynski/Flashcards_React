import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';

const UpdateFlashcard = () => {
    const location = useLocation();
    const { flashcard, deck } = location.state || {};
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [flashcardId, setFlashcardId] = useState(flashcard.flashcardId);
    const [question, setQuestion] = useState(flashcard.question);
    const [answer, setAnswer] = useState(flashcard.answer);
    const [notes, setNotes] = useState(flashcard.notes);
    const [isLanguageFlashcard, setIsLanguageFlashcard] = useState(Boolean(flashcard.isLanguageFlashcard));
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.patch('api/Flashcard/UpdateFlashcard', {
                "FlashcardId": flashcardId,
                "Question": question,
                "Answer": answer,
                "Notes": notes,
                "IsLanguageFlashcard": isLanguageFlashcard
            });

            if (response.status === 200) {
                // Flashcard update successful
                navigate(`/browseflashcards/${deck.deckId}`, { state: { deck } });
            }
        } catch (e) {
            console.error('Error updating flashcard:', e);
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
            <h1>Update Flashcard</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <form>
                        <label htmlFor="question">Question:</label>
                        <input
                            type="text"
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                        />

                        <label htmlFor="answer">Answer:</label>
                        <input
                            type="text"
                            id="answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            required
                        />

                        <label htmlFor="notes">Notes:</label>
                        <input
                            type="text"
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />

                        <label htmlFor="isLanguageFlashcard">Is Language Flashcard:</label>
                        <input
                            type="checkbox"
                            id="isLanguageFlashcard"
                            checked={isLanguageFlashcard}
                            onChange={(e) => setIsLanguageFlashcard(e.target.checked)}
                        />
                    </form>

                    <button className="btn btn-primary mt-4 m-2" type="button" onClick={handleSubmit}>
                        Save
                    </button>
                    <button className="btn btn-secondary mt-4 m-2" type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                </>
            )}
        </div>
    );
};

export default UpdateFlashcard;
