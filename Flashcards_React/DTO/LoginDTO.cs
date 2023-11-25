using System.ComponentModel.DataAnnotations;

namespace Flashcards_React.DTO
{
    public class LoginDTO
    {
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
    }
}
