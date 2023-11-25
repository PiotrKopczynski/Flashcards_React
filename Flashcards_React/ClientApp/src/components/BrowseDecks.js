import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';
import PageButton from './PageButton'
import './StyleFile.css'; 

const BrowseDecks = () => {
    const [decks, setDecks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [hasPreviousPage, setHasPreviousPage] = useState();
    const [hasNextPage, setHasNextPage] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    // Fetch decks from the server
    const getDecks = async (page) => {
        try {
            // CHECK HERE THAT PAGE IS NOT LARGER THAN TOTALPAGES
            const response = await api.get(`api/Deck/BrowseDecks?pageNumber=${page}`);

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
        
        getDecks(page);
    }, [page]);

    const handleUpdateDeckButton = (deck) => {
        navigate(`/updatedeck/${deck.deckId}`, { state: {deck}});
    }
    const handleCreateDeckButton = () => {
        navigate(`/createdeck`, { state: { } });
    }
    const handleDeleteDeckButton = (deck) => {
        navigate(`/deletedeck/${deck.deckId}`, { state: {deck} });
    }

    const pagesArray = Array(totalPages).fill().map((_, index) => index + 1)

    const lastPage = () => setPage(totalPages)

    const firstPage = () => setPage(1)

    const nav = (
        <nav className="nav">
            <button onClick={firstPage} disabled={!hasPreviousPage || page === 1}>&lt;&lt;</button>
            {/* Removed isPreviousData from PageButton to keep button focus color instead */}
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
                    {nav}
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {decks.map(deck => (
                            <div key={deck.deckId} className="col">
                                <div className="card text-center" style={{ width: '18rem' }}>
                                    <div className="card-body">
                                        <h2 className="fs-3 card-title">{deck.title}</h2>
                                        <p className="card-text">{deck.description}</p>
                                        <button class="btn btn-secondary mt-2" onClick={() => handleUpdateDeckButton(deck)}>
                                            <i class="fas fa-pen-to-square"></i>
                                        </button>
                                        <button class="btn btn-danger mt-2" onClick={() => handleDeleteDeckButton(deck)}>
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                        <button class="btn btn-outline-primary" onClick={() => handleCreateDeckButton()}>
                        Create New Deck
                        </button>
                </>
            )}
        </div>
    );
};

export default BrowseDecks;