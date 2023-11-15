using System.ComponentModel.DataAnnotations;

namespace Flashcards_React.DTO
{
    public class CreateDeckDTO
    {
        [Required]
        [StringLength(100)]
        public required string Title { get; set; }
        [StringLength(300)]
        public string? Description { get; set; }
    }
}
