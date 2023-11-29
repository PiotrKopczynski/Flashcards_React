import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';
import PaginationNav from './PaginationNav';
import './BrowseFlashcards.css';
import TextToSpeechSettings from './TextToSpeechSettings';
import TextToSpeech from './TextToSpeech';
import MissingCat from './MissingCat';

const BrowseFlashcards = () => {
    const location = useLocation();
    const { deck } = location.state;
    const [flashcards, setFlashcards] = useState();
    const [flashcardPage, setFlashcardPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [hasPreviousPage, setHasPreviousPage] = useState();
    const [hasNextPage, setHasNextPage] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    //const [showContent, setShowContent] = useState(false);
    const [showContentArray, setShowContentArray] = useState([]);

    useEffect(() => {
        if (flashcards) {
            // Initialize the showContentArray with false for each flashcard
            setShowContentArray(new Array(flashcards.length).fill(false));
        }
    }, [flashcards]);

    const [utterance, setUtterance] = useState(null);

    useEffect(() => {
        // Initialize utterance when component mounts
        setUtterance(new SpeechSynthesisUtterance());
    }, []);

    const getFlashcards = async (flashcardPage) => {
        try {
            flashcardPage = (flashcardPage < 0) ? 1 : flashcardPage;
            flashcardPage = (flashcardPage > totalPages) ? totalPages : flashcardPage;
            const response = await api.get(`api/Flashcard/BrowseFlashcards?deckId=${deck.deckId}&pageNumber=${flashcardPage}`);
            if (response.status === 200) {
                setFlashcards(response.data.list);
                setTotalPages(response.data.totalPages);
                setHasPreviousPage(response.data.hasPreviousPage);
                setHasNextPage(response.data.hasNextPage);
                setLoading(false);
            }
        } catch (e) {
            console.error("Error fetching flashcards:", e);
            if (e.isTokenRefreshError) { // The refresh of the JWT token failed or the tokens were invalid.
                // Navigate users with an invalid token pair out of the authenticated content
                setAuth({ isLoggedIn: false })
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                navigate('/login');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!auth.isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }
        getFlashcards(flashcardPage);
    }, [flashcardPage]);

    const handleCreateFlashcardButton = (deck) => {
        navigate(`/createflashcard/${deck.deckId}`, { state: { deck } });
    };

    const handleDetailButton = (flashcard, deck) => {
        navigate(`/detailflashcard/${flashcard.flashcardId}`, { state: { flashcard, deck } });
    };

    const handleBackToDeckButton = () => {
        navigate(`/browsedecks`);
    };

    const toggleContent = (index) => {
        setShowContentArray((prevArray) => {
            const newArray = [...prevArray];
            newArray[index] = !newArray[index];
            return newArray;
        });
    };

    const [textToSpeechSettings, setTextToSpeechSettings] = useState({
        pitch: 1,
        rate: 1,
        volume: 1,
    });

    const handleTextToSpeechSettingsUpdate = (newSettings) => {
        setTextToSpeechSettings((prevSettings) => ({
            ...prevSettings,
            ...newSettings,
        }));
    };

    return (
        <div>
            <h1 className="fs-2 text-center">Flashcards</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                    <>
                        {(flashcards && flashcards.length) ? <TextToSpeechSettings onUpdateSettings={handleTextToSpeechSettingsUpdate} utterance={utterance} /> :
                            <div id="emptyResultsContainer">
                                <h1 class="text-center fs-4 mt-5">It looks like this deck is empty. Go ahead and create some cards :)</h1>
                                <MissingCat />
                            </div>}                       
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {flashcards.map((flashcard, index) => (
                                <div key={flashcard.flashcardId} className="col">
                                    <div className="card text-center">
                                        <div className="card-body">
                                            <p className="card-text">Question: {flashcard.question}</p>
                                            {showContentArray[index] && (
                                                <>
                                                    <p className="card-text">Answer: {flashcard.answer}</p>
                                                    {showContentArray[index] && (
                                                        <TextToSpeech
                                                            text={flashcard.answer}
                                                            isLanguageFlashcard={flashcard.isLanguageFlashcard}
                                                            settings={textToSpeechSettings}
                                                        />
                                                    )}
                                                    <p className="card-text">Notes: {flashcard.notes}</p>
                                                </>
                                            )}
                                            <button className="btn btn-secondary mt-3 mx-2" onClick={() => toggleContent(index)}>
                                                {showContentArray[index] ? 'Hide answer' : 'Show answer'}
                                            </button>
                                            <button
                                                className="btn btn-primary mt-3 mx-1"
                                                onClick={() => handleDetailButton(flashcard, deck)}>
                                                Inspect
                                            </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>

                        <div className="buttons-container">
                            <div className="create-flashcard-section">
                                <button className="btn btn-outline-primary mt-3 mx-2" onClick={() => handleCreateFlashcardButton(deck)}>
                                    Create a Flashcard
                                </button>
                                <button className="btn btn-outline-primary mt-3 mx-2" onClick={() => handleBackToDeckButton()}>
                                    Back to Decks
                                </button>
                            </div>
                            <div className="controller-pagination">
                                {(flashcards && flashcards.length) ? <PaginationNav setPage={setFlashcardPage} hasPreviousPage={hasPreviousPage}
                                    hasNextPage={hasNextPage} totalPages={totalPages} />:<div></div>}
                            </div>
                        </div>    
                </>
            )}
        </div>
    );
};

export default BrowseFlashcards;