import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';

const DeleteDeck = () => {
    const location = useLocation();
    const { deck } = location.state;
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const handleDelete = async () => {
        if (!auth.isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }

        try {
            const response = await api.delete(`api/Deck/DeleteDeck?id=${deck.deckId}`);
            if (response.status === 200) {
                console.log("DeleteDeck response: ", response.data);
                navigate('/browsedecks');
            }
        } catch (e) {
            console.log("Error in DeleteDeck:", e);
            if (e.isTokenRefreshError) {
                setAuth({ isLoggedIn: false });
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
            <h1>Delete Deck</h1>
            <p>Are you sure you want to delete the following deck?</p>
            <p>Title: {deck.title}</p>
            <p>Description: {deck.description}</p>
            <button class="btn btn-danger mx-3 mt-5" type="button" onClick={handleDelete}>Delete</button>
            <button class="btn btn-secondary mt-5" type="button" onClick={handleCancel}>Cancel</button>
        </div>
    );
};

export default DeleteDeck;
