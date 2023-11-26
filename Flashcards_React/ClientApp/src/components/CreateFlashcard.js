import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';
import './StyleFile.css';

const CreateFlashcard = () => {
    const location = useLocation();
    const { deck } = location.state;
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [notes, setNotes] = useState('');
    const [isLanguageFlashcard, setIsLanguageFlashcard] = useState(false);

    const handleCreate = async () => {
        if (!auth.isLoggedIn) {
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
        <div>
            <h1>Create Flashcard</h1>
            <form>
                <label htmlFor="question">Question:</label>
                <input
                    type="text"
                    id="question"
                    value={question}
                    required
                    onChange={(e) => setQuestion(e.target.value)}
                />

                <label htmlFor="answer">Answer:</label>
                <input
                    type="text"
                    id="answer"
                    value={answer}
                    required
                    onChange={(e) => setAnswer(e.target.value)}
                />

                <label htmlFor="notes">Notes:</label>
                <input
                    type="text"
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <div className="form-group">
                    <label htmlFor="isLanguageFlashcard">Is Language Flashcard:</label>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="isLanguageFlashcard"
                            className="form-check-input"
                            checked={isLanguageFlashcard}
                            onChange={() => setIsLanguageFlashcard(!isLanguageFlashcard)}
                        />
          
                    </div>
                </div>
            </form>
            <button className="btn btn-primary mt-5 m-2" type="button" onClick={handleCreate}>Create</button>
            <button className="btn btn-secondary mt-5 m-2" type="button" onClick={handleCancel}>Cancel</button>
        </div>
    );
};

export default CreateFlashcard;
