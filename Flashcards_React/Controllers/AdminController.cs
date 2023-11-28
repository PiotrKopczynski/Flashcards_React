using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Flashcards_React.Controllers
{
    [Authorize(Roles = "admin")]
    [Route("api/[controller]")] // The square brackets will be filled with the controller name so in this case this will be api/authentication.
    [ApiController]
    public class AdminController : ControllerBase
    // This is a Controller with functions related to the admin role.
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ILogger<AdminController> _logger;

        public AdminController(UserManager<IdentityUser> userManager, ILogger<AdminController> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet]
        [Route("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            // We do not include a unit test for this method as we did not find a way to setup the return of _userManager.Users.ToListAsync();
            List<IdentityUser> users = await _userManager.Users.ToListAsync();
            if (users == null)
            {
                _logger.LogError("[AdminController] Users not found when trying to retrieve them using _userManager.Users.ToListAsync()");
                return BadRequest("Users not found.");
            }
            return Ok(users);
        }
    }
}