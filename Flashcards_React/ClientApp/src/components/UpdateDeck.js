import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';
import './UpdateDeck.css';

const UpdateDeck = () => {
    const location = useLocation();
    const { deck } = location.state;
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const [title, setTitle] = useState(deck.title);
    const [description, setDescription] = useState(deck.description);

    const handleSubmit = async () => {
        if (!auth.isLoggedIn) {
            // Navigate unauthenticated users out of the authenticated content
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
        <section className="deck-form">
            <h1 className="fs-2 mx-3 mb-5">Update Deck</h1>
            <form className="deck-form">
                <div className="form-floating pb-4">
                    
                    <input 
                        type="text"
                        className="form-control"
                        placeholder="Title"
                        id = "title"
                        value = {title}
                        required
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label htmlFor="title fs-4">Title</label>
                </div>
                <div className="form-floating pb-4">
                    
                    <input 
                        type="text"
                        className="form-control"
                        placeholder="Description fs-4"
                        id = "description"
                        value = {description}
                        required
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <label htmlFor="description">Description</label>
                </div>
            </form>
            <button className="btn btn-primary mt-4 m-2" type="button" onClick={handleSubmit}>Save</button>
            <button className="btn btn-secondary mt-4 m-2" type="button" onClick={handleCancel}>Cancel</button>
        </section>
    );
};

export default UpdateDeck;