using System.ComponentModel.DataAnnotations;

namespace Flashcards_React.DTO
{
    public class UpdateDeckDTO
    {
        [Required]
        public required int DeckId { get; set; }
        [Required]
        [StringLength(100)]
        public required string Title { get; set; }
        [StringLength(300)]
        public string? Description { get; set; }
    }
}
