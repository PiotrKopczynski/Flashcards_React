using Azure;
using Flashcards_React.Controllers;
using Flashcards_React.DAL;
using Flashcards_React.DTO;
using Flashcards_React.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestPlatform.ObjectModel.DataCollection;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XunitTestFlashcards_React.Controllers
{
    public class DeckControllerTests
    {
        // Declaring decks and DTO's used for testing
        private readonly Deck deck1 = new()
        {
            DeckId = 1,
            Title = "Test1",
            Description = "This is the first test deck.",
            Flashcards = null,
            FlashcardsUserId = ""
        };

        private readonly Deck deck2 = new()
        {
            DeckId = 2,
            Title = "Test2",
            Description = "This is the second test deck.",
            Flashcards = null,
            FlashcardsUserId = ""
        };

        private readonly CreateDeckDTO createDeckDTO = new()
        {
            Title = "Test1",
            Description = "This is the first test deck."
        };

        private readonly UpdateDeckDTO updateDeckDTO = new()
        {
            DeckId = 1,
            Title = "Test1",
            Description = "This is the first test deck."
        };

        private readonly int testId = 1;



        private static DeckController CreateDeckController(Mock<IDeckRepository> mockDeckRepository)
        // This function creates a DeckController instance and is used to prevent
        // reuse of code in the unit tests.
        {
            // Create a mock UserStore that is needed to create a mock UserManager.
            var mockUserStore = new Mock<IUserStore<IdentityUser>>();
            // Create a mock UserManager.
            var mockUserManager = new Mock<UserManager<IdentityUser>>(
                mockUserStore.Object, null, null, null, null, null, null, null, null);
            // Create a mock logger
            var mockLogger = new Mock<ILogger<DeckController>>();
            return new DeckController(mockDeckRepository.Object, mockLogger.Object, mockUserManager.Object);
        }

        [Fact]
        public async Task TestBrowseDecksWithoutSearch()
        {
            // Arrange
            var deckList = new List<Deck>()
            {
                deck1, deck2
            };
            PaginatedList<Deck>? paginatedDeckList = PaginatedList<Deck>.Create(deckList, 1, 6);

            var mockDeckRepository = new Mock<IDeckRepository>();
            // The flashcardUserId passed in to the GetAll function in the controller will be an empty string "",
            // so for the test to work, an empty string needs to be passed in here as well.
            mockDeckRepository.Setup(repo => repo.GetAll("")).ReturnsAsync(deckList);
            var deckController = CreateDeckController(mockDeckRepository);

            // Act
            var result = await deckController.BrowseDecks("", null);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);

            var response = okResult.Value as dynamic;
            Assert.NotNull(response);

            if (response != null)
            {
                var resultingDecks = response.List;
                var totalPages = response.TotalPages;
                var hasPreviousPage = response.HasPreviousPage;
                var hasNextPage = response.HasNextPage;

                Assert.Equal(1, totalPages);
                Assert.Equal(deckList, resultingDecks);
                Assert.False(hasPreviousPage);
                Assert.False(hasNextPage);
            }
        }

        [Fact]
        public async Task TestBrowseDecksWithSearch()
        {
            // Arrange
            var deckList = new List<Deck>()
            {
                deck1, deck2
            };

            var searchString = "test";

            var mockDeckRepository = new Mock<IDeckRepository>();
            // The flashcardUserId passed in to the GetAll function in the controller will be an empty string "",
            // so for the test to work, an empty string needs to be passed in here as well.
            mockDeckRepository.Setup(repo => repo.SearchDecksByTitle("", searchString)).ReturnsAsync(deckList);
            var deckController = CreateDeckController(mockDeckRepository);

            // Act
            var result = await deckController.BrowseDecks(searchString, null);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);

            var response = okResult.Value as dynamic;
            Assert.NotNull(response);

            if (response != null)
            {
                var resultingDecks = response.List;
                var totalPages = response.TotalPages;
                var hasPreviousPage = response.HasPreviousPage;
                var hasNextPage = response.HasNextPage;

                Assert.Equal(1, totalPages);
                Assert.Equal(deckList, resultingDecks);
                Assert.False(hasPreviousPage);
                Assert.False(hasNextPage);
            }
        }

        [Fact]
        public async Task TestBrowseDecksFails()
        {
            // Arrange
            var deckList = new List<Deck>()
            {
                deck1, deck2
            };

            var mockDeckRepository = new Mock<IDeckRepository>();
            // The flashcardUserId passed in to the GetAll function in the controller will be an empty string "",
            // so for the test to work, an empty string needs to be passed in here as well.
            mockDeckRepository.Setup(repo => repo.GetAll("")).ReturnsAsync((IEnumerable<Deck>?)null);
            var deckController = CreateDeckController(mockDeckRepository);

            // Act
            var result = await deckController.BrowseDecks("", null);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal(404, notFoundResult.StatusCode);

            var errorMessage = Assert.IsAssignableFrom<String>(notFoundResult.Value);
            Assert.Equal("Deck list not found", errorMessage);
        }

        [Fact]
        public async Task TestCreateDeckFails()
        {
            // Arrange
            var mockDeckRepository = new Mock<IDeckRepository>();
            // Below It.IsAny<Deck>() is used because a new deck object is created in the CreateDeck function, such
            // that the deck object created in the unit test may be equal to the object created in the CreateDeck
            // function, but the pointers will point to two separate objects in memory,
            // such that the Create() function will always return false. 
            mockDeckRepository.Setup(repo => repo.Create(It.IsAny<Deck>())).ReturnsAsync(false);
            var deckController = CreateDeckController(mockDeckRepository);

            // Act
            var result = await deckController.CreateDeck(createDeckDTO);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var badResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badResult.StatusCode);

            var errorMessage = Assert.IsAssignableFrom<String>(badResult.Value);
            Assert.Equal("Deck creation failed", errorMessage);
        }

        [Fact]
        public async Task TestCreateDeckPasses()
        {
            // Arrange
            var mockDeckRepository = new Mock<IDeckRepository>();
            // Below It.IsAny<Deck>() is used because a new deck object is created in the CreateDeck function, such
            // that the deck object created in the unit test may be equal to the object created in the CreateDeck
            // function, but the pointers will point to two separate objects in memory,
            // such that the Create() function will always return false. 
            mockDeckRepository.Setup(repo => repo.Create(It.IsAny<Deck>())).ReturnsAsync(true);
            var deckController = CreateDeckController(mockDeckRepository);

            // Act
            var result = await deckController.CreateDeck(createDeckDTO);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);

            var message = Assert.IsAssignableFrom<String>(okResult.Value);
            Assert.Equal("Success", message);
        }

        [Fact]
        public async Task TestUpdateDeckFails()
        {
            // Arrange
            var mockDeckRepository = new Mock<IDeckRepository>();
            mockDeckRepository.Setup(repo => repo.GetDeckById(1)).ReturnsAsync(deck1);
            mockDeckRepository.Setup(repo => repo.Update(deck1)).ReturnsAsync(false);
            var deckController = CreateDeckController(mockDeckRepository);

            // Act
            var result = await deckController.UpdateDeck(updateDeckDTO);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var badResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badResult.StatusCode);
            var errorMessage = Assert.IsAssignableFrom<String>(badResult.Value);
            Assert.Equal("Deck update failed", errorMessage);
        }

        [Fact]
        public async Task TestUpdateDeckPasses()
        {
            // Arrange
            var mockDeckRepository = new Mock<IDeckRepository>();
            mockDeckRepository.Setup(repo => repo.GetDeckById(testId)).ReturnsAsync(deck1);
            mockDeckRepository.Setup(repo => repo.Update(deck1)).ReturnsAsync(true);
            var deckController = CreateDeckController(mockDeckRepository);

            // Act
            var result = await deckController.UpdateDeck(updateDeckDTO);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);

            var message = Assert.IsAssignableFrom<String>(okResult.Value);
            Assert.Equal("Success", message);
        }

        [Fact]
        public async Task TestDeleteDeckFails()
        {
            // Arrange
            var mockDeckRepository = new Mock<IDeckRepository>();
            mockDeckRepository.Setup(repo => repo.Delete(testId)).ReturnsAsync(false);
            var deckController = CreateDeckController(mockDeckRepository);

            // Act
            var result = await deckController.DeleteDeck(testId);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var badResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badResult.StatusCode);

            var errorMessage = Assert.IsAssignableFrom<String>(badResult.Value);
            Assert.Equal("Deck deletion failed", errorMessage);
        }

        [Fact]
        public async Task TestDeleteDeckPasses()
        {
            // Arrange
            var mockDeckRepository = new Mock<IDeckRepository>();
            mockDeckRepository.Setup(repo => repo.Delete(testId)).ReturnsAsync(true);
            var deckController = CreateDeckController(mockDeckRepository);

            // Act
            var result = await deckController.DeleteDeck(testId);

            // Assert
            Assert.IsAssignableFrom<IActionResult>(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);

            var message = Assert.IsAssignableFrom<String>(okResult.Value);
            Assert.Equal("Success", message);
        }
    }
}