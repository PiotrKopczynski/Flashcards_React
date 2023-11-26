import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';
import PaginationNav from './PaginationNav';
import './StyleFile.css'; 

const BrowseFlashcards = () => {
    const location = useLocation();
    const { deck } = location.state;
    const [flashcards, setFlashcards] = useState([]);
    const [flashcardPage, setFlashcardPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [hasPreviousPage, setHasPreviousPage] = useState();
    const [hasNextPage, setHasNextPage] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const getFlashcards = async (flashcardPage) => {
        try {
            flashcardPage = (flashcardPage < 0) ? 1 : flashcardPage;
            flashcardPage = (flashcardPage > totalPages) ? totalPages : flashcardPage;
            const response = await api.get(`api/Flashcard/BrowseFlashcards?deckId=${deck.deckId}&pageNumber=${flashcardPage}`);
            if (response.status === 200) {
                setFlashcards(response.data.flashcards);
                setTotalPages(response.data.totalPages);
                setHasPreviousPage(response.data.hasPreviousPage);
                setHasNextPage(response.data.hasNextPage);
                setLoading(false);
            }
        } catch (e) {
            console.error("Error fetching flashcards:", e);
            if (e.isTokenRefreshError) { // The refresh of the JWT token failed or the tokens were invalid.
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
                     {(flashcards && flashcards.length) ? <PaginationNav setPage={setFlashcardPage} hasPreviousPage={hasPreviousPage}
                         hasNextPage={hasNextPage} totalPages={totalPages}/> : <div id="emptyResultsContainer">The search results are empty</div>}
                    <button className="btn btn-primary mx-5 mt-2 mb-5" onClick={() => handleCreateFlashcardButton(deck)}>
                        Create a Flashcard
                    </button>
                    <button className="btn btn-primary mx-5 mt-2 mb-5" onClick={() => handleBackToDeckButton()}>
                        Back to Decks
                    </button>
                </>
            )}
        </div>
    );
};

export default BrowseFlashcards;
