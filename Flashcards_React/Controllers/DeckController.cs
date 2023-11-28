using Flashcards_React.DAL;
using Flashcards_React.DTO;
using Flashcards_React.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;

namespace Flashcards_React.Controllers
{
    [Authorize]
    [Route("api/[controller]")] // The square brackets will be filled with the controller name so in this case this will be api/authentication.
    [ApiController]
    public class DeckController : ControllerBase
    {
        private readonly IDeckRepository _deckRepository;
        private readonly ILogger<DeckController> _logger;
        private readonly UserManager<IdentityUser> _userManager;

        public DeckController(IDeckRepository deckRepository,
            ILogger<DeckController> logger,
            UserManager<IdentityUser> userManager)
        {
            _deckRepository = deckRepository;
            _logger = logger;
            _userManager = userManager;
        }

        [HttpGet]
        [Route("BrowseDecks")]
        public async Task<IActionResult> BrowseDecks(string? searchString, int? pageNumber)
        // Function that retrieves a list of Decks from the database. The Decks can be filtered using the optional searchString parameter.
        {
            var flashcardsUserId = _userManager.GetUserId(this.User) ?? ""; // If the flashcardsUserId cannot be retrieved, set it to "".
            IEnumerable<Deck>? decks; // Initiate the deck list.
            if (string.IsNullOrEmpty(searchString)) // Check whether the user wants to perform a search.
            {
                decks = await _deckRepository.GetAll(flashcardsUserId);
                if (decks == null)
                {
                    _logger.LogError("[DeckController] Deck list not found while executing _deckRepository.GetAll()");
                    return NotFound("Deck list not found");
                }
            }
            else
            {
                decks = await _deckRepository.SearchDecksByTitle(flashcardsUserId, searchString);
                if (decks == null)
                {
                    _logger.LogError("[DeckController] Deck list not found while executing _deckRepository.SearchDecksByTitle()");
                    return NotFound("Deck list not found");
                }
            }
            var pageSize = 6;
            // We return the decks wrapped in the PaginatedList<> class such that not all decks are sent to the frontend at once.
            PaginatedList<Deck> paginatedDecks = PaginatedList<Deck>.Create(decks.ToList(), pageNumber ?? 1, pageSize)
                ?? new PaginatedList<Deck>(new List<Deck>(), 0, 1, 1);

            var response = new PaginatedResponseDTO<Deck>
            {
                List = paginatedDecks,
                TotalPages = paginatedDecks.TotalPages,
                HasPreviousPage = paginatedDecks.HasPreviousPage,
                HasNextPage = paginatedDecks.HasNextPage
            };

            return Ok(response);
        }

        [HttpPost]
        [Route("CreateDeck")]
        public async Task<IActionResult> CreateDeck([FromBody] CreateDeckDTO deckDTO)
        {
            if (ModelState.IsValid) // Server side validation.
            {
                var deck = new Deck()
                {
                    Title = deckDTO.Title,
                    Description = deckDTO.Description,
                };
                deck.FlashcardsUserId = _userManager.GetUserId(User) ?? ""; // If the flashcardsUserId cannot be retrieved, set it to "".
                bool returnOk = await _deckRepository.Create(deck);
                if (returnOk)
                {
                    return Ok("Success");
                }
            }
            _logger.LogWarning("[DeckController] Deck creation failed for the deckDTO: {deckDTO}", deckDTO);
            return BadRequest("Deck creation failed");
        }

        [HttpPatch]
        [Route("UpdateDeck")]
        public async Task<IActionResult> UpdateDeck([FromBody] UpdateDeckDTO deckDTO)
        {
            if (ModelState.IsValid) // Server side validation.
            {
                var existingDeck = await _deckRepository.GetDeckById(deckDTO.DeckId);
                if (existingDeck == null)
                {
                    return NotFound("Deck not found");
                }

                existingDeck.Title = deckDTO.Title;
                existingDeck.Description = deckDTO.Description;

                bool returnOk = await _deckRepository.Update(existingDeck);
                if (returnOk)
                {
                    return Ok("Success");
                }
            }
            _logger.LogWarning("[DeckController] Deck update failed for the deckDTO: {deckDTO}", deckDTO);
            return BadRequest("Deck update failed");
        }

        [HttpDelete]
        [Route("DeleteDeck")]
        public async Task<IActionResult> DeleteDeck(int id)
        {
            bool returnOk = await _deckRepository.Delete(id);
            if (!returnOk)
            {
                _logger.LogError("[DeckController] Deck deletion failed for the DeckId {@id}", id);
                return BadRequest("Deck deletion failed");
            }
            return Ok("Success");
        }
    }
}