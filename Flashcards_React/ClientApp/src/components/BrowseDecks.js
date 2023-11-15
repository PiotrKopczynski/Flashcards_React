import React, { useEffect, useState } from 'react';

const DeckList = () => {
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch decks from the server
        fetch('deck/browsedecks') // Adjust the URL to match your API endpoint
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
                            {/* Render other properties as needed */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeckList;





/*import React, { useEffect, useState } from 'react';

const BrowseDecks = () => {
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch decks from the server
        fetch('deck/browsedecks/') // Adjust the URL to match your API endpoint
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
                            }
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseDecks;
*/