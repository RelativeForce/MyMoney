﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MyMoney.Infrastructure.EntityFramework;

namespace MyMoney.Infrastructure.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20200725115436_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
                .HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("MyMoney.Infrastructure.Entities.Budget", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
                        .HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

                    b.Property<decimal>("Amount");

                    b.Property<string>("MonthId");

                    b.Property<string>("Name");

                    b.Property<string>("Notes");

                    b.Property<long>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Budgets");
                });

            modelBuilder.Entity("MyMoney.Infrastructure.Entities.Transaction", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
                        .HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

                    b.Property<decimal>("Amount");

                    b.Property<DateTime>("Date");

                    b.Property<string>("Description")
                        .IsRequired();

                    b.Property<long>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId", "Date", "Description")
                        .IsUnique();

                    b.ToTable("Transactions");
                });

            modelBuilder.Entity("MyMoney.Infrastructure.Entities.TransactionBudget", b =>
                {
                    b.Property<long>("BudgetId");

                    b.Property<long>("TransactionId");

                    b.HasKey("BudgetId", "TransactionId");

                    b.HasIndex("TransactionId");

                    b.ToTable("TransactionBudget");
                });

            modelBuilder.Entity("MyMoney.Infrastructure.Entities.User", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
                        .HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("DateOfBirth");

                    b.Property<string>("Email")
                        .IsRequired();

                    b.Property<string>("FullName")
                        .IsRequired();

                    b.Property<string>("Password")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("MyMoney.Infrastructure.Entities.Budget", b =>
                {
                    b.HasOne("MyMoney.Infrastructure.Entities.User", "UserProxy")
                        .WithMany("BudgetsProxy")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MyMoney.Infrastructure.Entities.Transaction", b =>
                {
                    b.HasOne("MyMoney.Infrastructure.Entities.User", "UserProxy")
                        .WithMany("TransactionsProxy")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MyMoney.Infrastructure.Entities.TransactionBudget", b =>
                {
                    b.HasOne("MyMoney.Infrastructure.Entities.Budget", "Budget")
                        .WithMany("TransactionsProxy")
                        .HasForeignKey("BudgetId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MyMoney.Infrastructure.Entities.Transaction", "Transaction")
                        .WithMany("BudgetsProxy")
                        .HasForeignKey("TransactionId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
