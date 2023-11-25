using System.ComponentModel.DataAnnotations;

namespace Flashcards_React.DTO
{
    public class TokenRequestDTO
    {
        [Required]
        public required string Token { get; set; }
        [Required]
        public required string RefreshToken { get; set; }
    }
}
