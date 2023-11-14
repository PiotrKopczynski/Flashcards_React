namespace Flashcards_React.Configurations
{
    public class JwtConfig
    {
        public string Secret { get; set; } = string.Empty;
        public TimeSpan ExpiryTimeFrame { get; set; }
    }
}
