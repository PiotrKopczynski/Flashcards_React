import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';

const CreateDeck = () => {
    const location = useLocation();
    const { deck } = location.state;
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = async () => {
        if (!auth.isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }

        try {
            const response = await api.post('api/Deck/CreateDeck', {
                Title: title,
                Description: description,
            });

            if (response.status === 200) { // Assuming 201 is the status code for successful creation
                console.log("CreateDeck response: ", response.data);
                navigate('/browsedecks');
            }
        } catch (e) {
            console.log("This is from the CreateDeck catch block:", e);
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
            <h1>Create Deck</h1>
            <form>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label htmlFor="description">Description:</label>
                <input
                    type="text"
                    id="description"
                    value={description}
                    required
                    onChange={(e) => setDescription(e.target.value)}
                />

                <button type="button" onClick={handleCreate}>Create</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
            
        </div>
    );
};

export default CreateDeck;
