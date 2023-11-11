using Flashcards_React.Models;

namespace Flashcards_React.DAL
{
    public class DBInit
    {
        public static void Seed(IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices.CreateScope();
            AuthDbContext context = serviceScope.ServiceProvider.GetRequiredService<AuthDbContext>();
            context.Database.EnsureCreated();

            if (!context.Decks.Any())
            {
                var decks = new List<Deck>
            {
                new Deck
                {
                    Title = "Norwegian flashcards",
                    Description = "This is a demo deck: A deck containing basic Norwegian language cards for learning.",
                    FlashcardsUserId = "demo"
                },
                new Deck
                {
                    Title = "Science quiz flashcard",
                    Description = "This is a demo deck: A deck containing science questions and answers ",
                    FlashcardsUserId = "demo"
                }
            };
                context.AddRange(decks);
                context.SaveChanges();
            }
            if (!context.Flashcards.Any())
            {
                var flashcards = new List<Flashcard>
            {
                new Flashcard
                {
                    Question = "Fishing rod",
                    Answer = "Fiskestang",
                    Notes = "Important to know before going on a fishing trip. :)",
                    DeckId = 1,
                    IsLanguageFlashcard = true
                },
                new Flashcard
                {
                    Question = "Brown cheese",
                    Answer = "Brunost",
                    Notes = "A national Norwegian chewy cheese with a brown colour and sweet taste.",
                    DeckId = 1,
                    IsLanguageFlashcard = true
                },
                new Flashcard
                {
                    Question = "Bench",
                    Answer = "Benk",
                    Notes = "Just a Bench :O",
                    DeckId = 1,
                    IsLanguageFlashcard = true
                },
                new Flashcard
                {
                    Question = "What is Newton's second law of physics?",
                    Answer = "F = ma",
                    Notes = "The acceleration of an object depends on the mass of the object and the amount of force applied.",
                    DeckId = 2,
                    IsLanguageFlashcard = false
                },
                new Flashcard
                {
                    Question = "What is photosynthesis?",
                    Answer = "The process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water.",
                    DeckId = 2,
                    IsLanguageFlashcard = false
                },

            };
                context.AddRange(flashcards);
                context.SaveChanges();
            }
        }
    }
}
