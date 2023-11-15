using Flashcards_React.Models;
using Microsoft.EntityFrameworkCore;

namespace Flashcards_React.DAL
{
    public class DeckRepository : IDeckRepository
    {
        private readonly AuthDbContext _db;
        private readonly ILogger<DeckRepository> _logger;

        public DeckRepository(AuthDbContext db, ILogger<DeckRepository> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<IEnumerable<Deck>?> GetAll(string flashcardsUserId)
        {
            try
            {
                return await _db.Decks.Where(x => x.FlashcardsUserId == flashcardsUserId | x.FlashcardsUserId == "demo").ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError("[DeckRepository] Where() failed when GetAll() was called, error message:{Message}", e.Message);
                return null;
            }
        }

        public async Task<Deck?> GetDeckById(int id)
        {
            try
            {
                return await _db.Decks.FindAsync(id);
            }
            catch (Exception e)
            {
                _logger.LogError("[DeckRepository] FindAsync() failed when GetDeckById() was called for DeckId {id} error message:{Message}", id, e.Message);
                return null;
            }
        }

        public async Task<bool> Create(Deck deck)
        {
            try
            {
                _db.Decks.Add(deck);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[DeckRepository] Add() failed for deck {deck}, error message:{Message}", deck, e.Message);
                return false;
            }
        }

        public async Task<bool> Update(Deck deck)
        {
            try
            {
                _db.Decks.Update(deck);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[DeckRepository] Update() failed when updating the deck with DeckId {DeckId}, error message:{Message}", deck.DeckId, e.Message);
                return false;
            }
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                var deck = await _db.Decks.FindAsync(id);
                if (deck == null)
                {
                    _logger.LogError("[DeckRepository] deck not found for the DeckId {id}", id);
                    return false;
                }
                _db.Decks.Remove(deck);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[DeckRepository] Remove() failed for the DeckId {id}, error message:{Message}", id, e.Message);
                return false;
            }
        }

        public async Task<IEnumerable<Deck>?> SearchDecksByTitle(string flashcardsUserId, string searchString)
        {
            try
            {
                // Converting the searchString and the Title to lowercase such that the search is case-insesitive.
                searchString = searchString.ToLower();
                return await _db.Decks.Where(deck => (deck.FlashcardsUserId == "demo" || deck.FlashcardsUserId == flashcardsUserId)
                //return await _db.Decks.Where(deck => (deck.FlashcardsUserId == flashcardsUserId)
                && deck.Title.ToLower().Contains(searchString)).ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError("[DeckRepository] SearchDecksByTitle() failed for UserId {flashcardsUserId} with error message:{Message}", flashcardsUserId, e.Message);
                return null;
            }
        }
    }
}
