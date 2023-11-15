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
    [ApiController]
    [Route("[controller]")]
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

        [HttpGet]
        [Route("browsedecks")]
        public async Task<ActionResult<IEnumerable<Deck>>> BrowseDecks()
        {
            String searchString = "";
            
            try
            {
                var flashcardsUserId = _userManager.GetUserId(this.User) ?? "";
                IEnumerable<Deck> decks;

                if (string.IsNullOrEmpty(searchString))
                {
                    decks = await _deckRepository.GetAll(flashcardsUserId);
                }
                else
                {
                    decks = await _deckRepository.SearchDecksByTitle(flashcardsUserId, searchString);
                }

                if (decks == null)
                {
                    _logger.LogError("[DeckController] Deck list not found.");
                    return NotFound("Deck list not found.");
                }

                
                return Ok(decks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[DeckController] Error while fetching decks.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }
    }
}
