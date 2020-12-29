# MyMoney

Welcome to MyMoney, a simple money management website written by Joshua Eddy. MyMoney is built using ASP.Net Core 3.1 with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0.

## Issue process
If you would like a new feature to be added please create a new feature issue.

## Local production setup 
Follow these steps to install and start a local instance of MyMoney.

1. Download and install SQL Server Express [here](https://www.microsoft.com/en-gb/sql-server/sql-server-downloads)
2. Download the latest release of the app [here](https://github.com/RelativeForce/MyMoney/releases)
3. Unzip it in some folder called `MyMoney`
4. Set up environment variables
   - `MyMoney_Email_Smtp_Server_URL`: The url of the SMTP email server
   - `MyMoney_Email_Address`: The email address of the account the site will use to send emails
   - `MyMoney_Email_Password`: The password of the account the site will use to send emails
   - `MyMoney_Database_Connection` (optional): The connection string to the database. Defaults to the local SQL express server instance.
   - `MyMoney_Database_Engine` (optional): The database type of the connection. Only `MySQL` and `SQLServer` are supported. Defaults to `SQLServer`.
   - `MyMoney_Token_Secret` (optional): The secret used for generating the user JWT tokens. You can generate one [here](https://www.grc.com/passwords.htm). Defaults to `dqSRHqsruH3U75hFSg1Y5LCOcON7G90iXGomYbaFuH4G10f2PIexSes3QlyidLC`.
5. Run `MyMoney.Web.exe`
6. MyMoney will be available at http://localhost:5000 or https://localhost:5001