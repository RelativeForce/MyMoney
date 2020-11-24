using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using MyMoney.Core;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Service;
using MyMoney.Core.Services;
using MyMoney.Infrastructure;
using MyMoney.Infrastructure.EntityFramework;
using MyMoney.Web.Utility;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace MyMoney.Web
{
   public class Startup
   {
      public Startup(IConfiguration configuration)
      {
         Configuration = configuration;
      }

      public IConfiguration Configuration { get; }

      // This method gets called by the runtime. Use this method to add services to the container.
      public void ConfigureServices(IServiceCollection services)
      {
         services.AddHttpContextAccessor();

         services.AddScoped<ITokenProvider, TokenProvider>();
         services.AddScoped<IUserService, UserService>();
         services.AddScoped<IRepository, Repository>();
         services.AddScoped<IRelationRepository, RelationRepository>();
         services.AddScoped<IBudgetService, BudgetService>();
         services.AddScoped<ITransactionService, TransactionService>();
         services.AddScoped<IEntityFactory, EntityFactory>();
         services.AddScoped<ICurrentUserProvider, CurrentUserProvider>();

         services.AddControllers();
         // In production, the Angular files will be served from this directory
         services.AddSpaStaticFiles(configuration =>
         {
            configuration.RootPath = "ClientApp/dist";
         });

         services.AddSwaggerDocument(settings =>
         {
            settings.Title = "MyMoney.Web.Api.0";
            settings.DocumentName = "v0";
            settings.ApiGroupNames = new[] { "0" };
            settings.Version = "0.0.0";

            settings.SerializerSettings = new JsonSerializerSettings
            {
               ContractResolver = new CamelCasePropertyNamesContractResolver
               {
                  NamingStrategy = new CamelCaseNamingStrategy
                  {
                     ProcessDictionaryKeys = false
                  }
               }
            };

            settings.AddSecurity(
               "Bearer",
               new NSwag.OpenApiSecurityScheme
               {
                  Name = "Authorization",
                  Type = NSwag.OpenApiSecuritySchemeType.ApiKey,
                  Scheme = "Bearer",
                  BearerFormat = "JWT",
                  In = NSwag.OpenApiSecurityApiKeyLocation.Header,
                  Description = "JWT Authorization header using the Bearer scheme."
               });
         });

         services.AddAuthentication(x =>
         {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
         })
         .AddJwtBearer(x =>
         {
            x.RequireHttpsMetadata = false;
            x.SaveToken = true;
            x.TokenValidationParameters = new TokenValidationParameters
            {
               ValidateIssuerSigningKey = true,
               IssuerSigningKey = new SymmetricSecurityKey(TokenProvider.Key),
               ValidateIssuer = false,
               ValidateAudience = false
            };
         });

         services.AddCors();
         services.AddDbContext<DatabaseContext>(options =>
             options
                 .UseLazyLoadingProxies()
                 .UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
      }

      // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
      public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
      {
         if (env.IsDevelopment())
         {
            app.UseDeveloperExceptionPage();
         }
         else
         {
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
         }

         app.UseHttpsRedirection();
         app.UseStaticFiles();
         if (!env.IsDevelopment())
         {
            app.UseSpaStaticFiles();
         }

         UpdateDatabase(app);

         app.UseOpenApi();
         app.UseSwaggerUi3();

         app.UseRouting();
         app.UseAuthentication();
         app.UseAuthorization();

         app.UseEndpoints(endpoints =>
         {
            endpoints.MapControllerRoute(
                   name: "default",
                   pattern: "{controller}/{action=Index}/{id?}");
         });

         app.UseSpa(spa =>
         {

            if (env.IsDevelopment())
            {
               spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
            }
         });
      }

      private static void UpdateDatabase(IApplicationBuilder app)
      {
         using (var serviceScope = app.ApplicationServices
             .GetRequiredService<IServiceScopeFactory>()
             .CreateScope())
         {
            using (var context = serviceScope.ServiceProvider.GetService<DatabaseContext>())
            {
               DatabaseSeeder.Setup(context);
               DatabaseSeeder.Seed(context);
            }
         }
      }
   }
}
