using club.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Filters;
using club.Models;
using club;
using Microsoft.AspNetCore.Http.Connections;
using club.Controllers;
using club.Hubs;
using club.Jobs;
using club.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using Quartz;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddMemoryCache();
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
}
);
builder.Services.AddCors(options =>
{
    options.AddPolicy("reactApp", policyBuilder =>
    {
        policyBuilder.WithOrigins("http://localhost:5173", "http://localhost:8080");
        policyBuilder.AllowAnyHeader();
        policyBuilder.AllowAnyMethod();
        policyBuilder.AllowCredentials();
    });
});
builder.Services.Configure<AuthMessageSenderOptions>(options =>
{
    options.SendGridKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
});
builder.Services.AddSignalR(); //WebSockets
var connectionString = builder.Configuration.GetConnectionString("PostgresConnection");
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseNpgsql(connectionString)
);
builder.Services.AddAuthentication()
    .AddCookie(IdentityConstants.ApplicationScheme, options =>
    {
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        };
        options.Cookie.SameSite = SameSiteMode.None;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        // Add these for cross-origin scenarios
        options.Cookie.HttpOnly = true;
        options.ExpireTimeSpan = TimeSpan.FromDays(365);
        options.SlidingExpiration = true;
    });
builder.Services.AddIdentityCore<ApplicationUser>().AddRoles<IdentityRole>().AddEntityFrameworkStores<MyDbContext>().AddApiEndpoints();

// Add Quartz for CRON
builder.Services.AddQuartz(q =>
{
    // Define the job and trigger
    q.AddJob<UpdateStockJob>(opts => opts.WithIdentity("UpdateStockJob"));
    q.AddTrigger(opts => opts
        .ForJob("UpdateStockJob")
        .WithIdentity("UpdateStockTrigger")
        .WithCronSchedule("0 * * ? * *")); // Every minute
});
builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddTransient<EmailSender, EmailSender>();
builder.Services.AddScoped<EmailFetcher>();
builder.Services.Configure<AuthMessageSenderOptions>(builder.Configuration);
builder.Services.AddHttpClient();

var app = builder.Build();

// Apply migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();
    dbContext.Database.Migrate(); // Apply pending migrations
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UsePathBase("/api");
app.UseCors("reactApp");
//app.MapIdentityApi<ApplicationUser>();
app.MapCustomIdentityApi<ApplicationUser>();
// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<MeetingHub>("/meetingHub");

app.Run();
