import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';

const BrowseDecks = () => {
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    useEffect(() => {
        if (!auth.isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }
        // Fetch decks from the server
        const getDecks = async () => {
            try {
                const searchString = ""; // Replace 'your_search_string' with the actual search string
                const response = await api.get(`api/Deck/BrowseDecks`);

                if (response.status === 200) {
                    setDecks(response.data);
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
        getDecks();
    }, []);

    return (
        <div>
            <h1>Deck List</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="deck-container">
                    {decks.map(deck => (
                        <div key={deck.deckId} className="card">
                            <h2>{deck.title}</h2>
                            <p>{deck.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseDecks;
