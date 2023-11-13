using Flashcards_React.Configurations;
using Flashcards_React.DTO;
using Flashcards_React.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Net.Mail;
using System.Net;

namespace Flashcards_React.Controllers
{
    [Route("api/[controller]")] // The square brackets will be filled with the controller name so in this case this will be api/authentication.
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthenticationController> _logger;

        public AuthenticationController(UserManager<IdentityUser> userManager, IConfiguration configuration, ILogger<AuthenticationController> logger)
        {
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            // Validate the incoming request.
            if (ModelState.IsValid)
            {
                // Check if the email already exists.
                var flashcardsUser = await _userManager.FindByEmailAsync(registerDTO.Email);

                if (flashcardsUser != null) {
                    _logger.LogError("[AuthenticationController] User registration failed. The email {Email} already exists!", registerDTO.Email);
                    return BadRequest(new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Email already exists"
                        }
                    });
                }

                // Create a user.
                var newFlashcardsUser = new IdentityUser()
                {
                    Email = registerDTO.Email,
                    UserName = registerDTO.Email,
                    EmailConfirmed = false
                };

                var created = await _userManager.CreateAsync(newFlashcardsUser, registerDTO.Password);

                if (created.Succeeded)
                {
                    // Generate a token.
                    /*var token = GenerateJwtToken(newFlashcardsUser); 
                    return Ok(new AuthResult()
                    {
                        Result = true,
                        Token = token
                    });*/

                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(newFlashcardsUser);

                    var callbackUrl = Request.Scheme + "://" + Request.Host + Url.Action("ConfirmEmail", "Authentication", new { flashcardsUserId = newFlashcardsUser.Id, code = code});

                    /*var callbackUrl = Url.Page(
                        "/api/Authentication/ConfirmEmail",
                        pageHandler: null,
                        values: new { userId = newFlashcardsUser, code = code },
                        protocol: Request.Scheme);*/

                    var emailBody = $"Please confirm your account by <a href='{callbackUrl}'>clicking here</a>.";

                    var subject = "Confirm your email.";

                    var resultOk = SendEmail(newFlashcardsUser.Email, subject, emailBody);

                    if (resultOk)
                    {
                        return Ok("Please verify your email, through the link in the verification email we sent.");
                    }
                    else
                    {
                        await _userManager.DeleteAsync(newFlashcardsUser);
                        return Ok("The email could not be sent, please try registering again.");
                    }
                }

                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>()
                    {
                        "Server error"
                    }
                });
            }
            else
            {
                _logger.LogError("[AuthenticationController] User registration failed. registerDTO: {registerDTO} is invalid", registerDTO);
                return BadRequest("User registration failed.");
            }
        }

        [Route("ConfirmEmail")]
        [HttpGet]
        public async Task<IActionResult> ConfirmEmail(string flashcardsUserId, string code)
        {
            if(flashcardsUserId == null || code == null)
            {
                return BadRequest(new AuthResult()
                {
                    Result= false, 
                    Errors = new List<string>()
                    {
                        "Invalid email confirmation url"
                    }
                });
            }

            var flashcardsUser = await _userManager.FindByIdAsync(flashcardsUserId);

            if (flashcardsUser == null)
            {
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>()
                    {
                        "Invalid email parameters"
                    }
                });
            }

            //code = Encoding.UTF8.GetString(Convert.FromBase64String(code));
            var result = await _userManager.ConfirmEmailAsync(flashcardsUser, code);
            var status = result.Succeeded ? "Thank you for confirming you email." : "Your email is not confirmed, please try again later.";

            return Ok(status);
        }

        [Route("Login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            if (ModelState.IsValid)
            {
                // Check if the user exists.
                var existingFlashcardsUser = await _userManager.FindByEmailAsync(loginDTO.Email);
                if (existingFlashcardsUser == null)
                {
                    return BadRequest(new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Invalid payload" // Not specifying how it failed for security purposes
                        }
                    });
                }

                if (!existingFlashcardsUser.EmailConfirmed)
                {
                    return BadRequest(new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Email needs to be confirmed"
                        }
                    });
                }

                var correctPassword = await _userManager.CheckPasswordAsync(existingFlashcardsUser, loginDTO.Password); // Check the password.

                if (!correctPassword)
                {
                    return BadRequest(new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Invalid credentials" // Not specifying if the email or password is invalid for security reasons.
                        }
                    });
                }

                var jwtToken = GenerateJwtToken(existingFlashcardsUser);

                return Ok(new AuthResult()
                {
                    Token = jwtToken,
                    Result = true
                });
            }

            _logger.LogError("[AuthenticationController] User login failed for the payload: {loginDTO}", loginDTO);
            return BadRequest(new AuthResult()
            {
                Result = false,
                Errors = new List<string>()
                {
                    "Invalid payload" // Not specifying how it failed for security purpose
                }
            });
        }

        private string GenerateJwtToken(IdentityUser flashcardsUser)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            //var key = Encoding.UTF8.GetBytes(_configuration.GetSection("JwtService:Secret").Value); // Get the secret key as an array of bytes

            var key = Encoding.UTF8.GetBytes(_configuration["JwtConfig:Secret"]);

            var tokenDescriptor = new SecurityTokenDescriptor() // Token descriptor that allows configure what the payload data of the jwt token will be.
            {
                Subject = new ClaimsIdentity(new [] // List of claims.
                {
                    new Claim("Id", flashcardsUser.Id),
                    new Claim(JwtRegisteredClaimNames.Sub, flashcardsUser.Email ?? ""),
                    new Claim(JwtRegisteredClaimNames.Email, flashcardsUser.Email ?? ""),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique token reference.
                    new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToUniversalTime().ToString()), // Creates a unique id that will be specific for the token and the user.
                }),

                Expires = DateTime.Now.AddHours(1), // The token is valid for 1 hour.
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512) // The credentials use our secret key and the HMAC-Sha256 Algorithm for encryption.
            };

            // Create the actual token using the token descriptor.
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token); // Writes the token to a string.
        }

        private bool SendEmail(string email, string subject, string confirmLink)
        // Function that uses the SMTP protocol for sending a email-confirmation.
        // Inputs: 
        // email: The email address to send the email to.
        // subject: The subject of the email.
        // confirmLink: The link in the email-confirmation message that the user needs to click to confirm their email.
        {
            try
            {
                MailMessage message = new();
                SmtpClient smtpClient = new();
                message.From = new MailAddress("webapplicationp50@gmail.com");
                message.To.Add(email);
                message.Subject = subject;
                message.IsBodyHtml = true;
                message.Body = confirmLink;

                smtpClient.Port = 587;
                smtpClient.Host = "smtp.gmail.com";

                smtpClient.EnableSsl = true;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential("webapplicationp50@gmail.com", "rukj bnjc oksp fblu");
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.Send(message);
                return true;
            }
            catch (Exception)
            {
                _logger.LogError("[AuthenticationController] The confirmation email could not be sent to {email}", email);
                return false;
            }
        }
    }
}
