global using RasManagement.Models;
global using Microsoft.EntityFrameworkCore;
using RasManagement.Interface;
using RasManagement.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using RasManagement.Repository.Data;
using Microsoft.Extensions.Configuration;
using RasManagement.Services;
using FluentAssertions.Common;
using RasManagement.Settings;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//Add Token Barier using JWT.
// Configure SMTP settings from appsettings.json

builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.Configure<TimeSheet>(builder.Configuration.GetSection("TimeSheet"));
builder.Services.AddTransient<IMailService, MailService>();


builder.Services.AddAuthentication(options =>
{

    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration.GetSection("Jwt:Issuer").Value,
        ValidateAudience = true,
        ValidAudience = builder.Configuration.GetSection("Jwt:Audience").Value,
        IssuerSigningKey = new SymmetricSecurityKey
        (Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Jwt:Key").Value)),
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };

});
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ProjectRasmanagementContext>();
builder.Services.AddTransient<IUnitWork, UnitWork>();
builder.Services.AddScoped<AccountRepository>();
builder.Services.AddScoped<EmployeeRepository>();
builder.Services.AddScoped<EmployeePlacementRepository>();
builder.Services.AddScoped<EducationRepository>();
builder.Services.AddScoped<EmploymentHistoryRepository>();
builder.Services.AddScoped<NonFormalEduRepository>();
builder.Services.AddScoped<QualificationRepository>();
builder.Services.AddScoped<CertificateRepository>();
builder.Services.AddScoped<ProjectHistoryRepository>();
builder.Services.AddScoped<UniversitasRepository>();
builder.Services.AddScoped<TurnOverRepository>();
builder.Services.AddScoped<DepartmentRepository>();
builder.Services.AddScoped<ShortlistRepository>();
builder.Services.AddScoped<AssetsRepository>();
builder.Services.AddScoped<HistoryLogRepository>();
builder.Services.AddScoped<ClientNameRepository>();
builder.Services.AddScoped<TimeSheetRepository>();
builder.Services.AddScoped<TrackingRepository>();
builder.Services.AddScoped<PositionRepository>();
builder.Services.AddScoped<MasterHolidayRepository>();
builder.Services.AddScoped<ApprovalRepository>();
builder.Services.AddScoped<SalesProjectionRepository>();
builder.Services.AddScoped<ActivitySalesProjectionRepository>();

//builder.Services.AddTransient<EducationRepository>();

builder.Services.AddCors(c =>
{
    c.AddPolicy("AllowOrigin", options => options
     .AllowAnyOrigin()
     .AllowAnyHeader()
     .AllowAnyMethod());
});


/*builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", builder =>
    {
        builder
            .WithOrigins("https://siramen.berca.co.id")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});*/

var app = builder.Build();

app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

}

/*app.UseSwagger();
app.UseSwaggerUI(o =>
{
    o.SwaggerEndpoint("/swagger/v1/swagger.json", "v1"); // options added on 17-4-2023
    o.RoutePrefix = string.Empty;
});*/

//If Deploy use 
/*app.UseSwagger();
app.UseSwaggerUI();*/



//IMPLEMENTASI CORS
app.UseCors(options => options
.AllowAnyOrigin()
.AllowAnyHeader()
.AllowAnyMethod());
app.UseHttpsRedirection();

app.UseAuthentication(); // Menambahkan middleware autentikasi

//Mengetahui Error
//app.UseDeveloperExceptionPage();

app.UseAuthorization();

app.MapControllers();

app.Run();