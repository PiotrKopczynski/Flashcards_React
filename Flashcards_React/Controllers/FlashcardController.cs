using Flashcards_React.DAL;
using Flashcards_React.DTO;
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
    public class FlashcardController : ControllerBase
    {
        private readonly IFlashcardRepository _flashcardRepository;
        private readonly IDeckRepository _deckRepository;
        private readonly ILogger<FlashcardController> _logger;

        public FlashcardController(IFlashcardRepository flashcardRepository, 
            IDeckRepository deckRepository, 
            ILogger<FlashcardController> logger)
        {
            _flashcardRepository = flashcardRepository;
            _deckRepository = deckRepository;
            _logger = logger;
        }

        [HttpGet]
        [Route("BrowseFlashcards")]
        public async Task<IActionResult> BrowseFlashcards(int deckId) // Maybe move this to the DeckController and use the list property of a deck?
        // Function that retrieves a list of Flashcards belonging to the deck with the 
        {
            var flashcards = await _flashcardRepository.GetFlashcardsByDeckId(deckId);
            if (flashcards == null)
            {
                _logger.LogError("[FlashcardController] Flashcards not found while executing _flashcardRepository.GetFlashcardsByDeckId() DeckId:{deckId}", deckId);
                return NotFound("Flashcard list not found");
            }
            return Ok(flashcards);
        }

        [HttpPost]
        [Route("CreateFlashcard")]
        public async Task<IActionResult> CreateFlashcard([FromBody] CreateFlashcardDTO flashcardDTO)
        {
            if (ModelState.IsValid) // Server side validation.
            {
                var flashcard = new Flashcard()
                {
                    Question = flashcardDTO.Question,
                    Answer = flashcardDTO.Answer,
                    Notes = flashcardDTO.Notes,
                    DeckId = flashcardDTO.DeckId,
                    IsLanguageFlashcard = flashcardDTO.IsLanguageFlashcard,
                };

                var deck = await _deckRepository.GetDeckById(flashcardDTO.DeckId); // Retrieve the deck that the flashcards belong to such that it can be assigned to the Deck attribute.
                if (deck == null)
                {
                    _logger.LogError("[FlashcardController] Deck not found when creating a new flashcard, DeckId {DeckId}", flashcardDTO.DeckId);
                    return NotFound("Deck not found when creating the flashcard.");
                }

                flashcard.Deck = deck;

                bool returnOk = await _flashcardRepository.Create(flashcard);
                if (returnOk)
                {
                    return Ok("Success");
                }
            }
            _logger.LogWarning("[FlashcardController] Flashcard creation failed for the flashcardDTO: {flashcardDTO}", flashcardDTO);
            return BadRequest("Flashcard creation failed");
        }

        [HttpPatch]
        [Route("UpdateFlashcard")]
        public async Task<IActionResult> UpdateFlashcard([FromBody] UpdateFlashcardDTO flashcardDTO)
        {
            if (ModelState.IsValid) // Server side validation.
            {
                var existingFlashcard = await _flashcardRepository.GetFlashcardById(flashcardDTO.FlashcardId);
                if (existingFlashcard == null)
                {
                    return NotFound("Flashcard not found");
                }

                existingFlashcard.Question = flashcardDTO.Question;
                existingFlashcard.Answer = flashcardDTO.Answer;
                existingFlashcard.Notes = flashcardDTO.Notes;
                existingFlashcard.IsLanguageFlashcard = flashcardDTO.IsLanguageFlashcard;

                bool returnOk = await _flashcardRepository.Update(existingFlashcard);
                if (returnOk)
                {
                    return Ok("Success");
                }
            }
            _logger.LogWarning("[FlashcardController] Flashcard update failed for the flashcardDTO: {flashcardDTO}", flashcardDTO);
            return BadRequest("Flashcard update failed");
        }

        [HttpDelete]
        [Route("DeleteFlashcard")]
        public async Task<IActionResult> DeleteFlashcard(int id)
        {
            bool returnOk = await _flashcardRepository.Delete(id);
            if (!returnOk)
            {
                _logger.LogError("[FlashcardController] Flashcard deletion failed for the FlashcardId {id}", id);
                return BadRequest("Flashcard deletion failed");
            }
            return Ok("Success");
        }
    }
}
