using System.Text.Json.Serialization;

namespace Flashcards_React.Models
{
    public class Flashcard
    {
        public int FlashcardId { get; set; }
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public int DeckId { get; set; }
        [JsonIgnore] // This is needed such that the endpoint does not try to send the Deck through a request as well.
        public virtual Deck Deck { get; set; } = default!; //Virtual keyword used for lazy loading.
        public bool IsLanguageFlashcard { get; set; } = false;
    }
}
