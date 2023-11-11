using Flashcards_React.Models;

namespace Flashcards_React.DAL
{
    public interface IDeckRepository
    {
        // Function used to search the decks by title.
        Task<IEnumerable<Deck>?> SearchDecksByTitle(string flashcardsUserId, string title);
        // Function to retrieve all the decks of the user with flashcardsUserId.
        Task<IEnumerable<Deck>?> GetAll(string flashcardsUserId);
        // Function returning the deck with the specified id.
        Task<Deck?> GetDeckById(int id);
        // Function for deck creation.
        Task<bool> Create(Deck deck);
        // Function for updating a deck.
        Task<bool> Update(Deck deck);
        // Function for deck deletion.
        Task<bool> Delete(int id);
    }
}
