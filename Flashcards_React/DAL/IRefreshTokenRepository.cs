using Flashcards_React.DTO;
using Flashcards_React.Models;

namespace Flashcards_React.DAL
{
    public interface IRefreshTokenRepository
    {
        // Function for creating refresh-tokens.
        Task<bool> Create(RefreshToken refreshToken);
        // Function for finding the refresh-token in the database given the refresh-token from the frontend request.
        Task<RefreshToken?> FindByToken(TokenRequestDTO tokenRequestDTO);
        // Function for updating refresh-tokens.
        Task<bool> Update(RefreshToken refreshToken);
    }
}
