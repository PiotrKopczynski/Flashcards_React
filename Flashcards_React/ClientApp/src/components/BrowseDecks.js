import React, { useEffect, useState } from 'react';

const BrowseDecks = () => {
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch decks from the server
        const searchString = 'your_search_string'; // Replace 'your_search_string' with the actual search string
        fetch(`api/deck/browsedecks?searchString=${searchString}`)
            .then(response => response.json())
            .then(data => {
                setDecks(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching decks:', error);
                setLoading(false);
            });
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
