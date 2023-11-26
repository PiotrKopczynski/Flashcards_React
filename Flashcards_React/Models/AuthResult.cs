namespace Flashcards_React.Models
{
    public class AuthResult
        // This class contains results of an authentication.
    {
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public bool Result { get; set; } // True = Success / False = Fail
        public List<string>? Errors { get; set; } // List containing the errors encountered during authentication
        public string? UserRole { get; set; } // The role of the currenty authenticated user
    }
}
