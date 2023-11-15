/*using Flashcards_React.DAL;
using Flashcards_React.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace Flashcards_React.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DeckController : ControllerBase
    {
        private readonly IDeckRepository _deckRepository;
        private readonly ILogger<DeckController> _logger;
        private readonly UserManager<FlashcardsUser> _userManager;

        public DeckController(IDeckRepository deckRepository, ILogger<DeckController> logger, UserManager<FlashcardsUser> userManager)
        {
            _deckRepository = deckRepository;
            _logger = logger;
            _userManager = userManager;
        }

        private static readonly IEnumerable<Deck> Decks = new[]
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

        [HttpGet]
        [Route("browsedecks")]
        public ActionResult<IEnumerable<Deck>> BrowseDecks()
        {
            return Ok(Decks);
        }
    }
}*/





using Flashcards_React.DAL;
using Flashcards_React.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Flashcards_React.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    [Route("[controller]")]
    public class DeckController : ControllerBase
    {
        private readonly IDeckRepository _deckRepository;
        private readonly ILogger<DeckController> _logger;
        private readonly UserManager<IdentityUser> _userManager;

        public DeckController(IDeckRepository deckRepository, ILogger<DeckController> logger, UserManager<IdentityUser> userManager)
        {
            _deckRepository = deckRepository;
            _logger = logger;
            _userManager = userManager;
        }

        [HttpGet]
        [Route("BrowseDecks")]
        public async Task<IEnumerable<Deck>> BrowseDecks(string searchString) // Double check that you can pass parameters like this through link.
        // The BrowseDecks View function allows the use to browse through the existing decks, create new decks and
        // search for specific decks using searchString. In addition, pagination functonality is implemented using the PaginatedList<> class.
        {
            var flashcardsUserId = _userManager.GetUserId(this.User) ?? ""; // If the flashcardsUserId cannot be retrieved, set it to "".
            Console.WriteLine(flashcardsUserId);
            IEnumerable<Deck>? decks; // Initiate the deck list.
            if (string.IsNullOrEmpty(searchString)) // Check whether the user wants to perform a search.
            {
                decks = await _deckRepository.GetAll(flashcardsUserId);
                if (decks == null)
                {
                    _logger.LogError("[DeckController] Deck list not found while executing _deckRepository.GetAll()");
                    return new List<Deck>();
                }
            }
            else
            {
                decks = await _deckRepository.SearchDecksByTitle(flashcardsUserId, searchString);
                }

                if (decks == null)
                {
                    _logger.LogError("[DeckController] Deck list not found while executing _deckRepository.SearchDecksByTitle()");
                    return new List<Deck>(); ;
                }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[DeckController] Error while fetching decks.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }

            return decks;
        }
    }
}
