using System.ComponentModel.DataAnnotations;

namespace Flashcards_React.DTO
{
    public class RegisterDTO
    {
        // The input validation is configured in Program.cs such that it is handles by the Identity package.
        [Required]
        public required string UserName { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
    }
}
