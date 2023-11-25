using Flashcards_React.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Flashcards_React.DTO
{
    public class CreateFlashcardDTO
    {
        [Required]
        public required string Question { get; set; }
        [Required]
        public required string Answer { get; set; }
        public string? Notes { get; set; }
        [Required]
        public required int DeckId { get; set; }
        [Required]
        public required bool IsLanguageFlashcard { get; set; }
    }
}
