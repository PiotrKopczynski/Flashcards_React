using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Flashcards_React.Models
{
    public class Deck
    {
        public int DeckId { get; set; }
        [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ. \-]{2,40}", ErrorMessage = "The Title must be numbers or letters and between 2 to 20 characters.")]
        public string Title { get; set; } = string.Empty;
        [StringLength(300)]
        public string? Description { get; set; }
        //navigation property
        [JsonIgnore] // This is needed such that the endpoint does not try to send the list of Flashcards through a request as well.
        public virtual List<Flashcard>? Flashcards { get; set; } //Virtual keyword used for lazy loading
        //navigation property
        public string FlashcardsUserId { get; set; } = string.Empty;
    }
}
