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
using Flashcards_React.DAL;

namespace Flashcards_React.Controllers
{
    [Route("api/[controller]")] // The square brackets will be filled with the controller name so in this case this will be api/authentication.
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthenticationController> _logger;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly TokenValidationParameters _tokenValidationParameters;

        public AuthenticationController(UserManager<IdentityUser> userManager, IConfiguration configuration,
            ILogger<AuthenticationController> logger, IRefreshTokenRepository refreshTokenRepository, TokenValidationParameters tokenValidationParameters)
        {
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
            _refreshTokenRepository = refreshTokenRepository;
            _tokenValidationParameters = tokenValidationParameters;
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

                // Create a object.
                var newFlashcardsUser = new IdentityUser()
                {
                    Email = registerDTO.Email,
                    UserName = registerDTO.UserName,
                    EmailConfirmed = false
                };
                // Create the user object in the database.
                var created = await _userManager.CreateAsync(newFlashcardsUser, registerDTO.Password);

                if (created.Succeeded)
                {
                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(newFlashcardsUser);

                    // In a production environment this url should be encoded such that sesitive data is not readable from the link
                    var callbackUrl = Request.Scheme + "://" + Request.Host + Url.Action("ConfirmEmail", "Authentication", new { flashcardsUserId = newFlashcardsUser.Id, code = code});

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

            var result = await _userManager.ConfirmEmailAsync(flashcardsUser, code);
            var status = result.Succeeded ? "Thank you for confirming you email." : "Your email is not confirmed, please try again later.";

            return Ok(status);
        }

        [HttpPost]
        [Route("Login")]
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

                var jwtToken = await GenerateJwtToken(existingFlashcardsUser);

                return Ok(jwtToken);
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

        [HttpPost]
        [Route("RefreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequestDTO tokenRequestDTO)
            // Endpoint for refreshing a JWT token given both the expired JWT and a refresh-token
        {
            if(ModelState.IsValid)
            {
                var result = await VerifyAndGenerateToken(tokenRequestDTO);

                if (result == null)
                {
                    return BadRequest(new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Invalid tokens"
                        }
                    });
                }
                return Ok(result);
            }

            return BadRequest(new AuthResult()
            {
                Result = false,
                Errors = new List<string>()
                {
                    "Invalid parameters"
                }
            });
        }

        private async Task<AuthResult?> VerifyAndGenerateToken(TokenRequestDTO tokenRequestDTO)
            // Function for verifying a pair of tokens and calling the function that generates a token pair.
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var invalidTokensResult = new AuthResult() // Declare this as a variable to reduce repeating code.
            {
                Result = false,
                Errors = new List<string>()
                        {
                            "Invalid tokens"
                        }
            };
            var expiredTokensResult = new AuthResult() // Declare this as a variable to reduce repeating code.
            {
                Result = false,
                Errors = new List<string>()
                        {
                            "Expired token"
                        }
            };

            try
            {
                _tokenValidationParameters.ValidateLifetime = false; // Such that the below validation does not fail for an expired token
                var tokenInVerification = jwtTokenHandler.ValidateToken(tokenRequestDTO.Token, _tokenValidationParameters, out var validatedToken);
                _tokenValidationParameters.ValidateLifetime = true; // Change this back such that the expired tokens are not considered valuid

                if (validatedToken is JwtSecurityToken jwtSecurityToken)
                {
                    // Check if the token use the same encryption algorithm.
                    var result = jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512, StringComparison.InvariantCultureIgnoreCase);

                    if (!result)
                    {
                        return null;
                    }
                }

                var storedToken = await _refreshTokenRepository.FindByToken(tokenRequestDTO);


                if (storedToken == null)
                {
                    return invalidTokensResult;
                }
                if (storedToken.IsUsed) {
                    return invalidTokensResult;
                }
                if (storedToken.IsRevoked)
                {
                    return invalidTokensResult;
                }

                string? jti = null;
                var jtiClaim = tokenInVerification.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti);

                if (jtiClaim != null) // If check to avoid null reference when calling .Value
                {
                    jti = jtiClaim.Value;
                }
                else
                {
                    return invalidTokensResult;
                }

                if(storedToken.JwtId != jti)
                {
                    return invalidTokensResult;
                }
                if(storedToken.ExpiryDate < DateTime.UtcNow)
                {
                    return expiredTokensResult;
                }

                storedToken.IsUsed = true;
                await _refreshTokenRepository.Update(storedToken);

                var tokenOwner = await _userManager.FindByIdAsync(storedToken.FlashcardsUserId);
                if (tokenOwner == null)
                {
                    return new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                {
                    "Token owner was not found"
                }
                    };
                }
                return await GenerateJwtToken(tokenOwner);
            }
            catch (SecurityTokenValidationException)
            {
                return invalidTokensResult;
            }
            catch (Exception)
            {
                return new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>()
                {
                    "Server error"
                }
                };
            }
        }

        private async Task<AuthResult> GenerateJwtToken(IdentityUser flashcardsUser)
            // This function creates a new JWT token and a RefreshToken for the flashcardsUser.
        {
            // Get the role of the user
            var roles = await _userManager.GetRolesAsync(flashcardsUser);
            var role = roles.FirstOrDefault() ?? "user";

            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.UTF8.GetBytes(_configuration["JwtConfig:Secret"] ?? ""); // Get the secret key as an array of bytes

            var tokenDescriptor = new SecurityTokenDescriptor() // Token descriptor that allows configure what the payload data of the jwt token will be.
            {
                Subject = new ClaimsIdentity(new[] // List of claims.
                {
                    new Claim("Id", flashcardsUser.Id),
                    new Claim(JwtRegisteredClaimNames.Sub, flashcardsUser.Id ?? ""),
                    new Claim(JwtRegisteredClaimNames.Email, flashcardsUser.Id ?? ""),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique token reference.
                    new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToUniversalTime().ToString()), // Creates a unique id that will be specific for the token and the user.
                    new Claim(ClaimTypes.Role, role) // Add role to the JWT for correct authorization
                }),
                
                Expires = DateTime.Now.Add(TimeSpan.Parse(_configuration["JwtConfig:ExpiryTimeFrame"] ?? "00:01:00")), // Check the JwtConfig:ExpiryTimeFrame in appsettings.
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512) // The credentials use our secret key and the HMAC-Sha256 Algorithm for encryption.
            };

            // Create the actual token using the token descriptor.
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = jwtTokenHandler.WriteToken(token); // Writes the token to a string.

            var refreshToken = new RefreshToken()
            {
                JwtId = token.Id,
                Token = RandomStringGeneration(20), // Generate Refresh Token using 20 random characters.
                AddedDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddMonths(6), // Our refresh-token currently has a 6 month expiry date
                IsRevoked = false,
                IsUsed = false,
                FlashcardsUserId = flashcardsUser.Id ?? "",
            };

            await _refreshTokenRepository.Create(refreshToken);

            return new AuthResult()
            {
                Token = jwtToken,
                RefreshToken = refreshToken.Token,
                Result = true,
                UserRole = role
            };
        }

        private string RandomStringGeneration(int length)
            // Function for generating a random string of large and lowercase letters, numbers and _
        {
            var random = new Random();
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz_";
            return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
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
                smtpClient.Credentials = new NetworkCredential("webapplicationp50@gmail.com", "rukj bnjc oksp fblu"); // An email we created specifically for this project
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
