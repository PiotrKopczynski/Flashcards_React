using Flashcards_React.Configurations;
using Flashcards_React.DAL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Flashcards_React.Models;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("AuthDbContextConnection") ?? throw new InvalidOperationException("Connection string 'AuthDbContextConnection' not found.");
// Add services to the container.
builder.Services.AddDbContext<AuthDbContext>(options => options.UseSqlite(connectionString));

builder.Services.Configure<JwtConfig>(builder.Configuration.GetSection("JwtConfig"));

var key = Encoding.ASCII.GetBytes(builder.Configuration.GetSection("JwtConfig:Secret").Value ?? "");

var tokenValidationParameters = new TokenValidationParameters()
{
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = new SymmetricSecurityKey(key),
    ValidateIssuer = false, // This is set to false for development purposes.
    ValidateAudience = false, // This is set to false for development purposes.
    RequireExpirationTime = true, // JWT tokens have a very short lifespans.
    ValidateLifetime = true
};

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

})
    .AddJwtBearer(jwt =>
    {
        jwt.SaveToken = true;
        jwt.TokenValidationParameters = tokenValidationParameters;
    });

builder.Services.AddSingleton(tokenValidationParameters);

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = false) // Register the Identity services.
    .AddRoles<IdentityRole>() // Add roles to Identity
    .AddEntityFrameworkStores<AuthDbContext>();

builder.Services.Configure<DataProtectionTokenProviderOptions>(o => o.TokenLifespan = TimeSpan.FromDays(1));

builder.Services.AddControllers();
//builder.Services.AddEndpointsApiExplorer(); maybe needed


builder.Services.AddScoped<IDeckRepository, DeckRepository>();
builder.Services.AddScoped<IFlashcardRepository, FlashcardRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

// Add logging
var loggerConfiguration = new LoggerConfiguration()
    .MinimumLevel.Information() // levels: Trace < Information < Warning < Error < Fatal
    .WriteTo.File($"Logs/app_{DateTime.Now:yyyyMMdd_HHmmss}.log");

loggerConfiguration.Filter.ByExcluding(e => e.Properties.TryGetValue("SourceContext", out var value) && //Filters out unnecessary string from the log file
                           e.Level == LogEventLevel.Information &&
                           e.MessageTemplate.Text.Contains("Executed DbCommand"));

var logger = loggerConfiguration.CreateLogger();
builder.Logging.AddSerilog(logger);

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
    using (var scope = app.Services.CreateScope()) // This lets us access the services that are configured above.
    {
        try
        {
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
            var userStore = scope.ServiceProvider.GetRequiredService<IUserStore<IdentityUser>>();
            DBInit.Seed(app, roleManager, userManager, userStore);
        }
        catch (Exception)
        {
            throw;
        }
    }
    app.UseHsts();
    app.UseDeveloperExceptionPage();
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
