import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

const DeckSearchBar = ({ setSearchString}) => {
    
    const handleSubmit = (e) => { // Prevent the form from reloading the page
        e.preventDefault()
        const formData = new FormData(e.target);
        const searchString = formData.get('search');
        setSearchString(searchString);
    }

    return (
        <div>
            <form className="search" onSubmit={handleSubmit}>
                <input
                    className="searchInput"
                    type="text"
                    id="search"
                    name="search"
                />
                <button className="searchButton">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </form>
        </div>
    );
};

export default DeckSearchBar;