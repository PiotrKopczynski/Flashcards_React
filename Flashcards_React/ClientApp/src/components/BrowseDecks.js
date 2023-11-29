import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';
import PaginationNav from './PaginationNav';
import DeckSearchBar from './DeckSearchBar';
import './StyleFile.css'; 

const BrowseDecks = () => {
    const [decks, setDecks] = useState();
    const [deckPage, setDeckPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [hasPreviousPage, setHasPreviousPage] = useState();
    const [hasNextPage, setHasNextPage] = useState();
    const [searchString, setSearchString] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    // Fetch decks from the server
    const getDecks = async (deckPage, searchString) => {
        try {
            deckPage = (deckPage < 0) ? 1 : deckPage;
            deckPage = (deckPage > totalPages) ? totalPages : deckPage;
            const response = await api.get(`api/Deck/BrowseDecks?pageNumber=${deckPage}&searchString=${searchString}`);
            if (response.status === 200) {
                setDecks(response.data.list);
                setTotalPages(response.data.totalPages);
                setHasPreviousPage(response.data.hasPreviousPage);
                setHasNextPage(response.data.hasNextPage);
                setLoading(false);
            }
        }
        catch (e) {
            console.error("Error fetching decks:", e);
            if (e.isTokenRefreshError) { // The refresh of the JWT token failed or the tokens were invalid.
                // Navigate users with a invalid token pair out of the authenticated content
                setAuth({ isLoggedIn: false })
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                navigate('/login');
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!auth.isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }        
        getDecks(deckPage, searchString);
    }, [deckPage, searchString]);

    const handleUpdateDeckButton = (deck) => {
        navigate(`/updatedeck/${deck.deckId}`, { state: {deck}});
    }
    const handleCreateDeckButton = () => {
        navigate(`/createdeck`, { state: { } });
    }
    const handleDeleteDeckButton = (deck) => {
        navigate(`/deletedeck/${deck.deckId}`, { state: {deck} });
    }
    const handleBrowseFlashcardsButton = (deck) => {
        navigate(`/browseflashcards/${deck.deckId}`, { state: { deck } });
    }

    return (
        <div>
            
            {loading ? (
                <>
                    <h1 className="fs-2">Deck List</h1>
                    <p>Loading...</p>
                </>
            ) : (
                <>
                    <DeckSearchBar setSearchString={setSearchString} />
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {decks.map(deck => (
                            <div key={deck.deckId} className="col">
                                <div className="deck text-center">
                                    <div className="deck-body">
                                        <h2 className="fs-3 card-title">{deck.title}</h2>
                                        <p className="deck-text">{deck.description}</p>
                                        <button className="btn btn-primary mt-2" onClick={() => handleBrowseFlashcardsButton(deck)}>
                                            <i className="fas fa-arrow-alt-circle-right"></i> View
                                        </button>
                                        <button className="btn btn-secondary mt-2 mx-1" onClick={() => handleUpdateDeckButton(deck)}>
                                            <i className="fas fa-pen-to-square"></i>
                                        </button>
                                        <button className="btn btn-danger mt-2" onClick={() => handleDeleteDeckButton(deck)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                        <div className="buttons-container">
                            <div className="create-deck-section">
                                <button className="btn btn-outline-primary mt-3" onClick={() => handleCreateDeckButton()}>
                                    Create New Deck
                                </button>
                            </div>
                            <div className="controller-pagination">
                                {(decks && decks.length) ? <PaginationNav page={deckPage} setPage={setDeckPage} hasPreviousPage={hasPreviousPage}
                                    hasNextPage={hasNextPage} totalPages={totalPages} /> : <div id="emptyResultsContainer">The search results are empty</div>}
                            </div>
                        </div>
                </>
            )}
        </div>
    );
};

export default BrowseDecks;