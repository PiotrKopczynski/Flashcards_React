import React, { useState, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';
import './CreateFlashcard.css';

const CreateFlashcard = () => {
    const location = useLocation();
    const { deck } = location.state;
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [notes, setNotes] = useState('');
    const [isLanguageFlashcard, setIsLanguageFlashcard] = useState(false);

    const textareaRef = useRef(null);
    const handleResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    const handleCreate = async () => {
        if (!auth.isLoggedIn) {
            // Navigate unauthenticated out of the authenticated content
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }

        try {
            const response = await api.post('api/Flashcard/CreateFlashcard', {
                Question: question,
                Answer: answer,
                Notes: notes,
                DeckId: deck.deckId,
                IsLanguageFlashcard: isLanguageFlashcard,
            });

            if (response.status === 200) { // Assuming 201 is the status code for successful creation
                console.log("CreateFlashcard response: ", response.data);
                navigate(`/browseflashcards/${deck.deckId}`, { state: { deck } });
            }
        } catch (e) {
            console.log("This is from the CreateFlashcard catch block:", e);
            if (e.isTokenRefreshError) {
                // Navigate users with a invalid token pair out of the authenticated content
                setAuth({ isLoggedIn: false });
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                navigate('/login');
            }
        }
    };

    const handleCancel = () => {
        navigate(`/browseflashcards/${deck.deckId}`, { state: { deck } });
    };

    return (
        <section className="flashcard-form-container">
            <h1 className="fs-2 mx-4 mb-5 text-center">Create Flashcard</h1>
            <form className="flashcard-form">
                <div className="form-group">

                    <label htmlFor="question" className="fs-4">Question:</label>
                    <textarea
                        className="form-control mt-2 mb-3"
                        id="question"
                        value={question}
                        required
                        onChange={(e) => {
                            setQuestion(e.target.value)
                            handleResize();
                        }}
                        style={{ height: 'auto', overflowY: 'hidden' }}
                    />

                    <label htmlFor="answer">Answer:</label>
                    <textarea
                        className="form-control mt-2 mb-3"
                        id="answer"
                        value={answer}
                        required
                        onChange={(e) => {
                            setAnswer(e.target.value)
                            handleResize();
                        }}
                        style={{ height: 'auto', overflowY: 'hidden' }}
                    />

                    <label htmlFor="notes">Notes:</label>
                    <textarea
                        className="form-control mt-2 mb-3"
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
                    <label htmlFor="isLanguageFlashcard" className="form-check-label mt-4 mb-1 fs-5">Is Language Flashcard:</label>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="isLanguageFlashcard"
                            checked={isLanguageFlashcard}
                            onChange={() => setIsLanguageFlashcard(!isLanguageFlashcard)}
                        />           
                </div>
            </form>
            <div className="form-buttons-container">
                <button className="btn btn-primary mt-5 m-2" type="button" onClick={handleCreate}>Create</button>
                <button className="btn btn-secondary mt-5 m-2" type="button" onClick={handleCancel}>Cancel</button>
            </div>
            
        </section>
    );
};

export default CreateFlashcard;
