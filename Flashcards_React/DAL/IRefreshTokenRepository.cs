using Flashcards_React.DTO;
using Flashcards_React.Models;

namespace Flashcards_React.DAL
{
    public interface IRefreshTokenRepository
    {
        Task<bool> Create(RefreshToken refreshToken);

        Task<RefreshToken?> FindByToken(TokenRequestDTO tokenRequestDTO);

        Task<bool> Update(RefreshToken refreshToken);
    }
}
