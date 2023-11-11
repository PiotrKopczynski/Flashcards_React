using Flashcards_React.Models;

namespace Flashcards_React.DAL
{
    public interface IFlashcardRepository
    {
        // Function for retrieving all flashcards.
        Task<IEnumerable<Flashcard>?> GetAll();
        // Function for retrieving a flashcards by its FlashcardId.
        Task<Flashcard?> GetFlashcardById(int id);
        // Function for retrieving the flashcards of a deck by using DeckId.
        Task<IEnumerable<Flashcard>?> GetFlashcardsByDeckId(int deckId);
        // Function for flashcard creation.
        Task<bool> Create(Flashcard flashcard);
        // Function for updating a flashcard.
        Task<bool> Update(Flashcard flashcard);
        // Function for flashcard deletion.
        Task<bool> Delete(int id);
    }
}
