import React, { useContext } from 'react';
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
            // Navigate unauthenticated users out of the authenticated content
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
                // Navigate users with a invalid token pair out of the authenticated content
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
        <section className="center-container">
            <div className="text-center">
                <h1 className=" fs-2 mx-4 mb-4">Delete Deck</h1>
                <p className="font-weight-bold mx-4 fs-5">
                    Are you sure you want to delete the following deck?   
                </p>
            </div>

            <div className="mx-4 mt-5 text-center">
                <p className="fs-5">Title: {deck.title}</p>
                <p className="fs-5">Description: {deck.description}</p>
                    
                <div class="mx-4">
                    <button className="btn btn-danger mx-3 mt-5" type="button" onClick={handleDelete}>Delete</button>
                    <button className="btn btn-secondary mt-5" type="button" onClick={handleCancel}>Cancel</button>
                </div>                
            </div>
        </section>
    );
};

export default DeleteDeck;
