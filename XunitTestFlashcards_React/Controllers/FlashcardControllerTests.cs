using Flashcards_React.Controllers;
using Flashcards_React.DAL;
using Flashcards_React.DTO;
using Flashcards_React.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XunitTestFlashcards_React.Controllers
{
    public class FlashcardControllerTests
    {
        // Declaring flashcards, a deck and DTO's used for testing
        private readonly Deck deck1 = new()
        {
            DeckId = 1,
            Title = "Test1",
            Description = "This is the first test deck.",
            Flashcards = null,
            FlashcardsUserId = ""
        };

        private readonly Flashcard flashcard1 = new()
        {
            FlashcardId = 1,
            Question = "Test1",
            Answer = "This is the first test card.",
            Notes = "Test notes.",
            DeckId = 1
        };

        private readonly Flashcard flashcard2 = new()
        {
            FlashcardId = 2,
            Question = "Test2",
            Answer = "This is the second test card.",
            Notes = "Test notes.",
            DeckId = 1
        };

        private readonly CreateFlashcardDTO createFlashcardDTO = new()
        {
            Question = "Test1",
            Answer = "This is the first test card.",
            Notes = "Test notes.",
            DeckId = 1,
            IsLanguageFlashcard = true
        };

        private readonly UpdateFlashcardDTO updateFlashcardDTO = new()
        {
            FlashcardId = 1,
            Question = "Test1",
            Answer = "This is the first test card.",
            Notes = "Test notes.",
            IsLanguageFlashcard = true
        };

        private readonly int testDeckId = 1;
        private readonly int testFlashcardId = 1;

        private FlashcardController CreateFlashcardController(Mock<IFlashcardRepository> mockFlashcardRepository)
        // This function created a FlashcardController instance and is used to prevent
        // reuse of code in the unit tests.
        {
            var testDeckId = 1;
            // Create and setup a deck repository for testing.
            var mockDeckRepository = new Mock<IDeckRepository>();
            mockDeckRepository.Setup(repo => repo.GetDeckById(testDeckId)).ReturnsAsync(deck1); // Setup the deck repository such that deck1 is returned given the testDeckId.
            // Create a mock logger
            var mockLogger = new Mock<ILogger<FlashcardController>>();
            return new FlashcardController(mockFlashcardRepository.Object, mockDeckRepository.Object, mockLogger.Object);
        }

        [Fact]
        public async Task TestBrowseFlashcardsPasses()
        {
            // Arrange
            var flashcardList = new List<Flashcard>()
            {
                flashcard1,flashcard2
            };

            PaginatedList<Flashcard>? paginatedFlashcardList = PaginatedList<Flashcard>.Create(flashcardList, 1, 6);

            var mockFlashcardRepository = new Mock<IFlashcardRepository>();
            mockFlashcardRepository.Setup(repo => repo.GetFlashcardsByDeckId(testDeckId)).ReturnsAsync(flashcardList);
            var deckController = CreateFlashcardController(mockFlashcardRepository);

            // Act
            var result = await deckController.BrowseFlashcards(testDeckId, null);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);

            var response = okResult.Value as dynamic;
            Assert.NotNull(response);

            if (response != null)
            {
                var resultingFlashcards = response.List;
                var totalPages = response.TotalPages;
                var hasPreviousPage = response.HasPreviousPage;
                var hasNextPage = response.HasNextPage;

                Assert.Equal(1, totalPages);
                Assert.Equal(flashcardList, resultingFlashcards);
                Assert.False(hasPreviousPage);
                Assert.False(hasNextPage);
            }
        }


        [Fact]
        public async Task TestBrowseFlashcardsFails()
        {
            // Arrange
            var flashcardList = new List<Flashcard>()
            {
                flashcard1,flashcard2
            };

            var mockFlashcardRepository = new Mock<IFlashcardRepository>();
            mockFlashcardRepository.Setup(repo => repo.GetFlashcardsByDeckId(testDeckId)).ReturnsAsync((IEnumerable<Flashcard>?)null);
            var deckController = CreateFlashcardController(mockFlashcardRepository);

            // Act
            var result = await deckController.BrowseFlashcards(testDeckId, null);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal(404, notFoundResult.StatusCode);

            var errorMessage = Assert.IsAssignableFrom<String>(notFoundResult.Value);
            Assert.Equal("Flashcard list not found", errorMessage);
        }

        [Fact]
        public async Task TestCreateFlashcardFails()
        {
            // Arrange
            var mockFlashcardRepository = new Mock<IFlashcardRepository>();
            // Below It.IsAny<Flashcard>() is used because a new flashcard object is created in the CreateFlashcard function, such
            // that the flashcard object created in the unit test may be equal to the object created in the CreateFlashcard
            // function, but the pointers will point to two separate objects in memory,
            // such that the Create() function will always return false. 
            mockFlashcardRepository.Setup(repo => repo.Create(It.IsAny<Flashcard>())).ReturnsAsync(false);
            var flashcardController = CreateFlashcardController(mockFlashcardRepository);

            // Act
            var result = await flashcardController.CreateFlashcard(createFlashcardDTO);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var badResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badResult.StatusCode);

            var errorMessage = Assert.IsAssignableFrom<String>(badResult.Value);
            Assert.Equal("Flashcard creation failed", errorMessage);
        }

        [Fact]
        public async Task TestCreateFlashcardPasses()
        {
            // Arrange
            var mockFlashcardRepository = new Mock<IFlashcardRepository>();
            // Below It.IsAny<Flashcard>() is used because a new flashcard object is created in the CreateFlashcard function, such
            // that the flashcard object created in the unit test may be equal to the object created in the CreateFlashcard
            // function, but the pointers will point to two separate objects in memory,
            // such that the Create() function will always return false.
            mockFlashcardRepository.Setup(repo => repo.Create(It.IsAny<Flashcard>())).ReturnsAsync(true);
            var flashcardController = CreateFlashcardController(mockFlashcardRepository);

            // Act
            var result = await flashcardController.CreateFlashcard(createFlashcardDTO);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);

            var message = Assert.IsAssignableFrom<String>(okResult.Value);
            Assert.Equal("Success", message);
        }

        [Fact]
        public async Task TestUpdateFlashcardFailsUpdate()
        {
            // Arrange
            var mockFlashcardRepository = new Mock<IFlashcardRepository>();
            mockFlashcardRepository.Setup(repo => repo.GetFlashcardById(updateFlashcardDTO.FlashcardId)).ReturnsAsync(flashcard1);
            mockFlashcardRepository.Setup(repo => repo.Update(flashcard1)).ReturnsAsync(false);
            var flashcardController = CreateFlashcardController(mockFlashcardRepository);

            // Act
            var result = await flashcardController.UpdateFlashcard(updateFlashcardDTO);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var badResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badResult.StatusCode);
            var errorMessage = Assert.IsAssignableFrom<String>(badResult.Value);
            Assert.Equal("Flashcard update failed", errorMessage);
        }

        [Fact]
        public async Task TestUpdateFlashcardFailsNotFound()
        {
            // Arrange
            var mockFlashcardRepository = new Mock<IFlashcardRepository>();
            mockFlashcardRepository.Setup(repo => repo.GetFlashcardById(updateFlashcardDTO.FlashcardId)).ReturnsAsync((Flashcard?)null);
            mockFlashcardRepository.Setup(repo => repo.Update(flashcard1)).ReturnsAsync(false);
            var flashcardController = CreateFlashcardController(mockFlashcardRepository);

            // Act
            var result = await flashcardController.UpdateFlashcard(updateFlashcardDTO);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal(404, notFoundResult.StatusCode);

            var errorMessage = Assert.IsAssignableFrom<String>(notFoundResult.Value);
            Assert.Equal("Flashcard not found", errorMessage);
        }

        [Fact]
        public async Task TestUpdateFlashcardFunctionPasses()
        {
            // Arrange
            var mockFlashcardRepository = new Mock<IFlashcardRepository>();
            mockFlashcardRepository.Setup(repo => repo.GetFlashcardById(updateFlashcardDTO.FlashcardId)).ReturnsAsync(flashcard1);
            mockFlashcardRepository.Setup(repo => repo.Update(flashcard1)).ReturnsAsync(true);
            var flashcardController = CreateFlashcardController(mockFlashcardRepository);

            // Act
            var result = await flashcardController.UpdateFlashcard(updateFlashcardDTO);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);

            var message = Assert.IsAssignableFrom<String>(okResult.Value);
            Assert.Equal("Success", message);
        }

        [Fact]
        public async Task TestDeleteFlashcardFails()
        {
            // Arrange
            var mockFlashcardRepository = new Mock<IFlashcardRepository>();
            mockFlashcardRepository.Setup(repo => repo.Delete(testFlashcardId)).ReturnsAsync(false);
            var flashcardController = CreateFlashcardController(mockFlashcardRepository);

            // Act
            var result = await flashcardController.DeleteFlashcard(testFlashcardId);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var badResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badResult.StatusCode);

            var errorMessage = Assert.IsAssignableFrom<String>(badResult.Value);
            Assert.Equal("Flashcard deletion failed", errorMessage);
        }

        [Fact]
        public async Task TestDeleteFlashcardPasses()
        {
            // Arrange
            var mockFlashcardRepository = new Mock<IFlashcardRepository>();
            mockFlashcardRepository.Setup(repo => repo.Delete(testFlashcardId)).ReturnsAsync(true);
            var flashcardController = CreateFlashcardController(mockFlashcardRepository);

            // Act
            var result = await flashcardController.DeleteFlashcard(testFlashcardId);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);

            var message = Assert.IsAssignableFrom<String>(okResult.Value);
            Assert.Equal("Success", message);
        }
    }
}