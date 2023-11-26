using Flashcards_React.Models;
using Microsoft.AspNetCore.Identity;

namespace Flashcards_React.DAL
{
    public class DBInit
    {
        public static void Seed(IApplicationBuilder app, RoleManager<IdentityRole> roleManager, UserManager<IdentityUser> userManager, IUserStore<IdentityUser> userStore)
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

            SeedRolesAsync(roleManager).GetAwaiter().GetResult();
            SeedUsersAsync(userManager, userStore).GetAwaiter().GetResult();

            context.SaveChanges();
        }

        // Create roles
        public static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            var roles = new[] { "admin", "user" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role)) // Check if role exists
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        // Create an admin user and a regular user.
        public static async Task SeedUsersAsync(UserManager<IdentityUser> userManager, IUserStore<IdentityUser> userStore)
        {
            var adminEmail = "admin@example.com";
            var adminUserName = "Admin";

            var userEmail = "testUser@example.com";
            var userUserName = "TestUser";

            var sharedPassword = "123456#eE"; // This is the password of the seeded users

            if (await userManager.FindByEmailAsync(adminEmail) == null) // If user does not exist.
            {
                var admin = CreateUser();

                var emailStore = (IUserEmailStore<IdentityUser>)userStore;
                await userStore.SetUserNameAsync(admin, adminUserName, CancellationToken.None);
                await emailStore.SetEmailAsync(admin, adminEmail, CancellationToken.None);

                admin.LockoutEnabled = false;
                admin.PhoneNumber = "4242424242";
                admin.EmailConfirmed = true;
                admin.PhoneNumberConfirmed = true;


                var adminResult = await userManager.CreateAsync(admin, sharedPassword);

                if (adminResult.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "admin");
                }
            }

            if (await userManager.FindByEmailAsync(userEmail) == null) // If user does not exist.
            {
                var user = CreateUser();

                var emailStore = (IUserEmailStore<IdentityUser>)userStore;
                await userStore.SetUserNameAsync(user, userUserName, CancellationToken.None);
                await emailStore.SetEmailAsync(user, userEmail, CancellationToken.None);

                user.LockoutEnabled = false;
                user.PhoneNumber = "6969696969";
                user.EmailConfirmed = true;
                user.PhoneNumberConfirmed = true;

                var userResult = await userManager.CreateAsync(user, sharedPassword);

                if (userResult.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "user");
                }
            }
        }

        // This function is taken from Register.cshtml.cs file in the previous MVC project.
        private static IdentityUser CreateUser()
        {
            try
            {
                return Activator.CreateInstance<IdentityUser>();
            }
            catch
            {
                throw new InvalidOperationException($"Can't create an instance of '{nameof(IdentityUser)}'. " +
                    $"Ensure that '{nameof(IdentityUser)}' is not an abstract class and has a parameterless constructor, or alternatively " +
                    $"override the register page in /Areas/Identity/Pages/Account/Register.cshtml");
            }
        }
    }
}
