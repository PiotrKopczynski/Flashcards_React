using Flashcards_React.DAL;
using Flashcards_React.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Flashcards_React.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
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
        public async Task<IEnumerable<Deck>> BrowseDecks(string? searchString) // Double check that you can pass parameters like this through link.
        // The BrowseDecks View function allows the use to browse through the existing decks, create new decks and
        // search for specific decks using searchString. In addition, pagination functonality is implemented using the PaginatedList<> class.
        {
            var flashcardsUserId = _userManager.GetUserId(this.User) ?? ""; // If the flashcardsUserId cannot be retrieved, set it to "".
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
                if (decks == null)
                {
                    _logger.LogError("[DeckController] Deck list not found while executing _deckRepository.SearchDecksByTitle()");
                    return new List<Deck>(); ;
                }
            }

            return decks;
        }
    }
}
