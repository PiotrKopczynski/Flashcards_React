import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';
import './UpdateFlashcard.css';

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

    const textareaRef = useRef(null);
    const handleResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

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
        <section className="deck-form">
            <h1 className="fs-2 mx-3 mb-5">Update Flashcard</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                        <form className="mx-4">
                            <div className="form-group">
                                <label htmlFor="question" className="mt-2 mb-1 fs-5">Question<span className="text-danger">*</span></label>
                                <textarea
                                    className="form-control"
                                    id="question"
                                    value={question}
                                    required
                                    onChange={(e) => {
                                        setQuestion(e.target.value)
                                        handleResize();
                                    }}
                                    style={{ height: 'auto', overflowY: 'hidden' }}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="answer" className="mt-2 mb-1 fs-5">Answer</label>
                                <textarea
                                    className="form-control"
                                    id="answer"
                                    value={answer}
                                    required
                                    onChange={(e) => {
                                        setAnswer(e.target.value)
                                        handleResize();
                                    }}
                                    style={{ height: 'auto', overflowY: 'hidden' }}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="notes" className="mt-2 mb-1 fs-5">Notes</label>
                                <textarea
                                    className="form-control"
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => {
                                        setNotes(e.target.value)
                                        handleResize();
                                    }}
                                    style={{ height: 'auto', overflowY: 'hidden' }}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="isLanguageFlashcard" className="form-check-label mt-4 mb-1 fs-5" >Is Language Flashcard:</label>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isLanguageFlashcard"
                                    checked={isLanguageFlashcard}
                                    onChange={(e) => setIsLanguageFlashcard(e.target.checked)}
                                />
                            </div>
                        </form>
                        <div className="form-buttons-container">
                            <button className="btn btn-primary mt-4 m-2" type="button" onClick={handleSubmit}>
                                Save
                            </button>
                            <button className="btn btn-secondary mt-4 m-2" type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                </>
            )}
        </section>
    );
};

export default UpdateFlashcard;
