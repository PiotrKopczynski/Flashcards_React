import React, { useState, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthProvider';
import './CreateDeck.css'; 


const CreateDeck = () => {
    const location = useLocation();
    //const { deck } = location.state;
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const textareaRef = useRef(null);
    const handleResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    const handleCreate = async () => {

        if (!auth.isLoggedIn) {
            // Navigate unauthenticated users out of the authenticated content
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
        <section className="deck-form-container">
            <h1 className="fs-2 mx-4 mb-5 text-center">Create Deck</h1>
            <form className="deck-form">
                <div className="form-group">
                    <label htmlFor="title" className="fs-4">Title<span className="text-danger">*</span></label>
                    <input
                        type="text"
                        className="form-control mt-2 mb-3"
                        id="title"
                        value={title}
                        required
                        onChange={(e) => setTitle(e.target.value)}  
                    />
                    
                    <label htmlFor="description" className="fs-4">Description</label>
                    <textarea
                        className="form-control mt-2 mb-3"
                        id="description"
                        value={description}
                        required
                        onChange={(e) => {
                            setDescription(e.target.value)
                            handleResize();
                        }}
                        style={{ height: 'auto', overflowY: 'hidden' }}
                    />
                </div>
                <div className="form-buttons-container">
                    <button className="btn btn-primary mt-5 m-2 fs-5" type="button" onClick={handleCreate}>Create</button>
                    <button className="btn btn-secondary mt-5 m-2 fs-5" type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>   
        </section>
    );
};

export default CreateDeck;
