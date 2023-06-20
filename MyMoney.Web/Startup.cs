using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using MyMoney.Core.Interfaces;
using MyMoney.Core.Interfaces.Email;
using MyMoney.Core.Interfaces.Service;
using MyMoney.Core.Services;
using MyMoney.Infrastructure;
using MyMoney.Infrastructure.Email;
using MyMoney.Infrastructure.EntityFramework;
using MyMoney.Web.Utility;
using MySql.EntityFrameworkCore;
using System;

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

         services.AddSingleton<ITokenProvider, TokenProvider>();
         services.AddScoped<IUserService, UserService>();
         services.AddScoped<IRepository, Repository>();
         services.AddScoped<IRelationRepository, RelationRepository>();
         services.AddScoped<IBudgetService, BudgetService>();
         services.AddScoped<IBasicTransactionService, BasicTransactionService>();
         services.AddScoped<IRecurringTransactionService, RecurringTransactionService>();
         services.AddScoped<IBasicIncomeService, BasicIncomeService>();
         services.AddScoped<IRecurringIncomeService, RecurringIncomeService>();
         services.AddScoped<IRunningTotalService, RunningTotalService>();
         services.AddScoped<IEntityFactory, EntityFactory>();
         services.AddScoped<ICurrentUserProvider, CurrentUserProvider>();
         services.AddSingleton<IEmailManager, EmailManager>();
         services.AddSingleton<IResourceManager, ResourceManager>();

         services.AddControllersWithViews();
         // In production, the Angular files will be served from this directory
         services.AddSpaStaticFiles(configuration =>
         {
            configuration.RootPath = $"FrontEnd/dist/apps/{FrontEndConstants.TargetFrontEndFramework}";
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
         {
            if (DatabaseConstants.TargetDatabaseEngine == DatabaseConstants.DatabaseEngine.SQLServer)
            {
               options
                  .UseLazyLoadingProxies()
                  .UseSqlServer(DatabaseConstants.DatabaseConnection);
            }

            if (DatabaseConstants.TargetDatabaseEngine == DatabaseConstants.DatabaseEngine.MySQL)
            {
               options
                  .UseLazyLoadingProxies()
                  .UseMySQL(DatabaseConstants.DatabaseConnection);
            }
         });
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
