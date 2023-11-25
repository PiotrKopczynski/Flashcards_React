import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './StyleFile.css'; 

const BrowseFlashcards = () => {
    const location = useLocation();
    const { deck } = location.state;
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getFlashcards = async () => {
            try {
                const response = await api.get(`api/Flashcard/BrowseFlashcards?deckId=${deck.deckId}`);
                if (response.status === 200) {
                    setFlashcards(response.data);
                    setLoading(false);
                    console.log(response.data);
                }
            } catch (error) {
                console.error("Error fetching flashcards:", error);
                setLoading(false);
            }
        };

        getFlashcards();
    }, []);


    const handleCreateFlashcardButton = (deck) => {
        navigate(`/createflashcard/${deck.deckId}`, { state: { deck } });
    }
    const handleBackToDeckButton = () => {
        navigate(`/browsedecks`);
    }

    return (
        <div>
            <h1>Flashcards</h1>
            {loading?(
                <p> Loading...</p >
            ) : (

                <>
                     <div className="row row-cols-1 row-cols-md-2 g-4">
                        {flashcards.map((flashcard) => (
                             <div key={flashcard.FlashcardId} className="col">
                                <div className="card text-center" style={{ width: '18rem' }}>
                                  <div className="card-body">
                                    <p className="card-text">Question: {flashcard.question}</p>
                                    <p className="card-text">Answer: {flashcard.answer}</p>
                                    <p className="card-text">Notes: {flashcard.notes}</p>
                                  </div>
                                </div>
                            </div>
                        ))}
                     </div>
                        <button class="btn btn-primary mx-5 mt-2 mb-5" onClick={() => handleCreateFlashcardButton(deck)}>
                            Create a Flashcard
                        </button>
                        <button class="btn btn-primary mx-5 mt-2 mb-5" onClick={() => handleBackToDeckButton()}>
                            Back to Decks
                        </button>
                </>
            )}
        </div>
    );
};

export default BrowseFlashcards;
