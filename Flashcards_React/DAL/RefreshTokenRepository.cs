using Flashcards_React.DTO;
using Flashcards_React.Models;
using Microsoft.EntityFrameworkCore;

namespace Flashcards_React.DAL
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
		private readonly AuthDbContext _db;
        private readonly ILogger<RefreshTokenRepository> _logger;

		public RefreshTokenRepository(AuthDbContext db, ILogger<RefreshTokenRepository> logger)
		{
			_db = db;
			_logger = logger;
		}
		
        public async Task<bool> Create(RefreshToken refreshToken)
        {
			try
			{
				_db.RefreshTokens.Add(refreshToken);
				await _db.SaveChangesAsync();
				return true;
			}
			catch (Exception e)
			{
				_logger.LogError("[RefreshTokenRepository] Add() failed for RefreshToken: {refreshToken}, error message:{Message}", refreshToken, e.Message );
				return false;
			}
        }

        public async Task<RefreshToken?> FindByToken(TokenRequestDTO tokenRequestDTO)
        {
			try
			{
				return await _db.RefreshTokens.FirstOrDefaultAsync(t => t.Token == tokenRequestDTO.RefreshToken);
			}
			catch (Exception e)
			{
                _logger.LogError("[RefreshTokenRepository] FirstOrDefaultAsync() failed when searching for the RefreshToken: {RefreshToken}, error message: {Message}", tokenRequestDTO.RefreshToken, e.Message );
                return null;
            }
        }

        public async Task<bool> Update(RefreshToken refreshToken)
        {
			try
			{
				_db.RefreshTokens.Update(refreshToken);
				await _db.SaveChangesAsync();
				return true;
			}
			catch (Exception e)
			{
                _logger.LogError("[RefreshTokenRepository] Update() failed when updating the RefreshToken {RefreshToken}, error message:{Message}",  refreshToken, e.Message);
                return false;
            }
        }
    }
}
