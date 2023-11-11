namespace Flashcards_React.Models
{
    public class Flashcard
    {
        public int FlashcardId { get; set; }
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public int DeckId { get; set; }
        public virtual Deck Deck { get; set; } = default!; //Virtual keyword used for lazy loading.
        public bool IsLanguageFlashcard { get; set; } = false;
    }
}
