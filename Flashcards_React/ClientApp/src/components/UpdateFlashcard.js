import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';

const UpdateFlashcard = () => {
    const location = useLocation();
    const flashcardData = location.state;
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const [flashcard, setFlashcard] = useState({
        FlashcardId: flashcardData.FlashcardId,
        DeckId: flashcardData.DeckId,
        Deck: flashcardData.Deck,
        IsLanguageFlashcard: flashcardData.IsLanguageFlashcard,
        Question: flashcardData.Question,
        Answer: flashcardData.Answer,
        Notes: flashcardData.Notes
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFlashcard({ ...flashcard, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auth.isLoggedIn) {
            // Navigate unauthenticated users out of the authenticated content
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
            return;
        }

        try {
            const response = await api.put(`api/Flashcard/UpdateFlashcard/${flashcard.FlashcardId}`, flashcard);
            if (response.status === 200) {
                console.log("UpdateFlashcard response: ", response.data);
                navigate(`/flashcard/details/${flashcard.FlashcardId}`);
            }
        } catch (error) {
            console.log("Error in UpdateFlashcard:", error);
            if (error.isTokenRefreshError) {
                setAuth({ isLoggedIn: false });
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                navigate('/login');
            }
        }
    };
   
    const handleCancel = () => {
        navigate(`/flashcard/details/${flashcard.FlashcardId}`);
    };

    return (
        <section className="deck-form">
            <h1 className="fs-2 mx-3 mb-5">Update Card</h1>

            <form onSubmit={handleSubmit} className="mx-4">
                <input type="hidden" name="FlashcardId" value={flashcard.FlashcardId} />
                <input type="hidden" name="DeckId" value={flashcard.DeckId} />
                <input type="hidden" name="Deck" value={flashcard.Deck} />

                <div className="form-group">
                    <label>Do you want text-to-speech to be available for this card:</label>
                    <div className="form-check">
                        <label className="form-check-label" htmlFor="IsLanguageFlashcard">Language Flashcard</label>
                        <input
                            className="form-check-input"
                            type="radio"
                            name="IsLanguageFlashcard"
                            value="true"
                            checked={flashcard.IsLanguageFlashcard === "true"}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-check">
                        <label className="form-check-label" htmlFor="IsLanguageFlashcard">Non-Language Flashcard</label>
                        <input
                            className="form-check-input"
                            type="radio"
                            name="IsLanguageFlashcard"
                            value="false"
                            checked={flashcard.IsLanguageFlashcard === "false"}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="Question" className="mt-2 mb-1">Question</label><span className="text-danger">*</span>
                    <input
                        type="text"
                        name="Question"
                        value={flashcard.Question}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                    {/* Validation message for Question */}
                </div>

                <div className="form-group">
                    <label htmlFor="Answer" className="mt-2 mb-1">Answer</label><span className="text-danger">*</span>
                    <input
                        type="text"
                        name="Answer"
                        value={flashcard.Answer}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                    {/* Validation message for Answer */}
                </div>

                <div className="form-group">
                    <label htmlFor="Notes" className="mt-2 mb-1">Notes</label>
                    <input
                        type="text"
                        name="Notes"
                        value={flashcard.Notes}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                    {/* Validation message for Notes */}
                </div>

                <div className="form-buttons-container">
                    <button class="btn btn-primary mt-4 m-2" type="button" onClick={handleSubmit}>Save Changes</button>
                    <button class="btn btn-secondary mt-4 m-2" type="button" onClick={handleCancel}>Cancel</button>
                    <p>Flashcard ID: {flashcard.FlashcardId}</p>
                    <p>Deck ID: {flashcard.DeckId}</p>
                    <p>Question: {flashcard.Question}</p>
                    <p>Answer: {flashcard.Answer}</p>
                    <p>Notes: {flashcard.Notes}</p>
                </div>
            </form>
        </section>
    );

};

export default UpdateFlashcard;
