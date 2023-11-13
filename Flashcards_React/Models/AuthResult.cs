namespace Flashcards_React.Models
{
    public class AuthResult
        // This class contains results of an authentication.
    {
        public string? Token { get; set; }
        public bool Result { get; set; }
        public List<string>? Errors { get; set; }
    }
}
