import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';

const UpdateDeck = () => {
    const location = useLocation();
    const { deck } = location.state;
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const [title, setTitle] = useState(deck.title);
    const [description, setDescription] = useState(deck.description);

    const handleSubmit = async () => {
        if (!auth.isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }
        try {
            const response = await api.patch(`api/Deck/UpdateDeck`, { "DeckId": deck.deckId, "Title": title, "Description": description });
            if (response.status === 200) {
                console.log("UpdateDeck response: ", response.data);
                navigate('/browsedecks')
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
        }
    };

    const handleCancel = () => {
        navigate('/browsedecks');
    };

    return (
        <div>
            <h1>Update Deck</h1>
            <form>
                <label htmlFor="title">Title:</label>
                <input 
                    type="text"
                    id = "title"
                    value = {title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label htmlFor="description">Description:</label>
                <input 
                    type="text"
                    id = "description"
                    value = {description}
                    required
                    onChange={(e) => setDescription(e.target.value)}
                />

                <button type="button" onClick={handleSubmit}>Save</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
            <p>Deck ID: {deck.deckId}</p>
            <p>Title: {deck.title}</p>
            <p>Description: {deck.description}</p>
        </div>
    );
};

export default UpdateDeck;