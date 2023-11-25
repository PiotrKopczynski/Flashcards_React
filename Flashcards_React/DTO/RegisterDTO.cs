using System.ComponentModel.DataAnnotations;

namespace Flashcards_React.DTO
{
    public class RegisterDTO
    {
        // Add input validation here?
        [Required]
        public required string UserName { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
    }
}
