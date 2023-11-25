using System.ComponentModel.DataAnnotations;

namespace Flashcards_React.DTO
{
    public class UpdateFlashcardDTO
    {
        [Required]
        public required int FlashcardId { get; set; }
        [Required]
        public required string Question { get; set; }
        [Required]
        public required string Answer { get; set; }
        public string? Notes { get; set; }
        [Required]
        public required bool IsLanguageFlashcard { get; set; }
    }
}
