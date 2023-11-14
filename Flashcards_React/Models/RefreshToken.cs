using Microsoft.AspNetCore.SignalR;

namespace Flashcards_React.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public required string FlashcardsUserId { get; set; }
        public required string Token {  get; set; }
        public required string JwtId { get; set; }
        public bool IsUsed { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime AddedDate { get; set; }
        public DateTime ExpiryDate { get; set; }

    }
}
