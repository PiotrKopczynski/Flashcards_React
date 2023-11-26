import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';
import PageButton from './PageButton';
import DeckSearchBar from './DeckSearchBar';
import './StyleFile.css'; 

const BrowseDecks = () => {
    const [decks, setDecks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [hasPreviousPage, setHasPreviousPage] = useState();
    const [hasNextPage, setHasNextPage] = useState();
    const [searchString, setSearchString] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    // Fetch decks from the server
    const getDecks = async (page, searchString) => {
        try {
            page = (page < 0) ? 1 : page;
            page = (page > totalPages) ? totalPages : page;
            var link = `api/Deck/BrowseDecks?pageNumber=${page}&searchString=${searchString}`
            const response = await api.get(link);

            if (response.status === 200) {
                setDecks(response.data.decks);
                setTotalPages(response.data.totalPages);
                setHasPreviousPage(response.data.hasPreviousPage);
                setHasNextPage(response.data.hasNextPage);
                setLoading(false);
            }
        }
        catch (e) {
            console.log("This is from the BrowseDecks catch block:", e);
            if (e.isTokenRefreshError) { // The refresh of the JWT token failed or the tokens were invalid.
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
        
        getDecks(page, searchString);
    }, [page, searchString]);

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

    const pagesArray = Array(totalPages).fill().map((_, index) => index + 1)

    const lastPage = () => setPage(totalPages)

    const firstPage = () => setPage(1)

    const nav = (
        <nav className="nav">
            <button onClick={firstPage} disabled={!hasPreviousPage || page === 1}>&lt;&lt;</button>
            {pagesArray.map(pg => <PageButton key={pg} pg={pg} setPage={setPage} />)}
            <button onClick={lastPage} disabled={!hasNextPage || page === totalPages}>&gt;&gt;</button>
        </nav>
    )



    return (
        <div>
            <h1>Deck List</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <DeckSearchBar setSearchString={setSearchString} />
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {decks.map(deck => (
                            <div key={deck.deckId} className="col">
                                <div className="deck text-center" style={{ width: '18rem' }}>
                                    <div className="deck-body">
                                        <h2 className="fs-3 card-title">{deck.title}</h2>
                                        <p className="deck-text">{deck.description}</p>
                                        <button className="btn btn-primary mt-2" onClick={() => handleBrowseFlashcardsButton(deck)}>
                                            <i className="fas fa-arrow-alt-circle-right"></i> View
                                        </button>
                                        <button className="btn btn-secondary mt-2" onClick={() => handleUpdateDeckButton(deck)}>
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
                        {(decks && decks.length) ? nav : <div id="emptyResultsContainer">The search results are empty :(</div>}
                    <button className="btn btn-outline-primary" onClick={() => handleCreateDeckButton()}>
                        Create New Deck
                    </button>
                </>
            )}
        </div>
    );
};

export default BrowseDecks;