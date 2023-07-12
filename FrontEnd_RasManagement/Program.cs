

using FrontEnd_RasManagement.Services;
using FrontEnd_RasManagement.Settings;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

//package

builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddTransient<IMailService, MailService>();

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

app.MapControllerRoute(
    name: "ResetPassword",
    pattern: "/ResetPassword/{resetToken}",
    defaults: new { controller = "Accounts", action = "ResetPassword" }
);

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Accounts}/{action=Login}");

app.Run();
