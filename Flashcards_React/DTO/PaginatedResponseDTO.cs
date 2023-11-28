using Flashcards_React.Models;
using System.ComponentModel.DataAnnotations;

namespace Flashcards_React.DTO
{
    public class PaginatedResponseDTO<T>
    // This class is utilized such that the unit tests are easier to write
    {
        [Required]
        public required PaginatedList<T> List { get; set; }
        [Required]
        public required int TotalPages { get; set; }
        [Required]
        public required bool HasPreviousPage { get; set; }
        [Required]
        public required bool HasNextPage { get; set; }
    }
}