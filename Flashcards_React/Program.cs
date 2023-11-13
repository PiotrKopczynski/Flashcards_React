using Flashcards_React.Configurations;
using Flashcards_React.DAL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("AuthDbContextConnection") ?? throw new InvalidOperationException("Connection string 'AuthDbContextConnection' not found.");
// Add services to the container.
builder.Services.AddDbContext<AuthDbContext>(options => options.UseSqlite(connectionString));

builder.Services.Configure<JwtConfig>(builder.Configuration.GetSection("JwtConfig"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

})
    .AddJwtBearer(jwt =>
    {
        var key = Encoding.ASCII.GetBytes(builder.Configuration.GetSection("JwtConfig:Secret").Value ?? "");

        jwt.SaveToken = true;
        jwt.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false, // This is set to false for development purposes.
            ValidateAudience = false, // This is set to false for development purposes.
            RequireExpirationTime = false, // JWT tokens have a very short lifespans. Refresh tokens are not implemented so this needs to be false.
            ValidateLifetime = true
        };
    });

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = false) // Register the Identity services.
    .AddEntityFrameworkStores<AuthDbContext>();

builder.Services.Configure<DataProtectionTokenProviderOptions>(o => o.TokenLifespan = TimeSpan.FromDays(1));

builder.Services.AddControllers();
//builder.Services.AddEndpointsApiExplorer(); maybe needed


builder.Services.AddScoped<IDeckRepository, DeckRepository>();
builder.Services.AddScoped<IFlashcardRepository, FlashcardRepository>();

/*builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
{
    policy.WithOrigins("https://localhost:44424/").AllowAnyMethod().AllowAnyHeader();
}));*/

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    DBInit.Seed(app);
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
//app.UseCors("FrontEnd");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
