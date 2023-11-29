import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import './DeckSearchBar.css';

const DeckSearchBar = ({ setSearchString}) => {
    
    const handleSubmit = (e) => { // Prevent the form from reloading the page
        e.preventDefault()
        const formData = new FormData(e.target);
        const searchString = formData.get('search');
        setSearchString(searchString);
    }

    return (
        <section className="search-bar">
            <h1 className="fs-2 mt-2">Browse Decks</h1>
            <form className="search" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="searchInput"
                        name="search"
                        placeholder="search here"
                        id="search"
                        name="search"
                    />
                    <button className="searchButton">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
            </form>
        </section>
    );
};

export default DeckSearchBar;