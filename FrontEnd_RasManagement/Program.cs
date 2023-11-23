

using FrontEnd_RasManagement.Services;
using FrontEnd_RasManagement.Settings;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

//Session
builder.Services.AddDistributedMemoryCache(); // Add a memory-based distributed cache for storing session data
builder.Services.AddSession(options =>
{
    // Configure session options as needed, e.g., timeout, cookie settings, etc.
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

//package

builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddTransient<IMailService, MailService>();
builder.Services.AddHostedService<MyBackground>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.UseSession();

app.MapControllerRoute(
    name: "ResetPassword",
    pattern: "/ResetPassword/{resetToken}",
    defaults: new { controller = "Accounts", action = "ResetPassword" }
);

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Accounts}/{action=Login}");

app.Run();
