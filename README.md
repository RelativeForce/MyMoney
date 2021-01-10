# MyMoney

Welcome to MyMoney, a simple money management website written by Joshua Eddy. MyMoney is built using ASP.Net Core 3.1 with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0.

## Issue process
If you would like a new feature to be added please create a new feature issue.

## Local production setup 
Follow these steps to install and start a local instance of MyMoney.

1. Download and install SQL Server Express [here](https://www.microsoft.com/en-gb/sql-server/sql-server-downloads)
2. Go to the latest release of the app [here](https://github.com/RelativeForce/MyMoney/releases/latest)
3. Download `MyMoney.exe`
4. Move `MyMoney.exe` to the folder you would like app to run from
5. Set up environment variables

   Email
   - `MyMoney_Email_Smtp_Server_URL`: The url of the SMTP email server
   - `MyMoney_Email_Smtp_Server_Port`: The port number of the SMTP email server
   - `MyMoney_Email_Smtp_Server_SSL` (optional): Whether or not to use SSL for requests to SMTP email server. Defaults to `true`.
   - `MyMoney_Email_Address`: The email address of the account the site will use to send emails
   - `MyMoney_Email_Password`: The password of the account the site will use to send emails

   Database
   - `MyMoney_Database_Connection` (optional): The connection string to the database. Defaults to the local SQL express server instance.
   - `MyMoney_Database_Engine` (optional): The database type of the connection. Only `MySQL` and `SQLServer` are supported. Defaults to `SQLServer`.

   Update
   - `MyMoney_Local_Web_App_Path` (optional): The folder path you would like to install the app into. Defaults to `Web` child folder.
   - `MyMoney_GitHub_URL` (optional): The URL to the public GitHub repository.
   - `MyMoney_Asset_File_Name` (optional): The filename of the asset to download. Requires 
     - `{0}` Major version number
     - `{1}` Minor version number
     - `{2}` Hotfix number

   Misc
   - `MyMoney_Token_Secret` (optional): The secret used for generating the user JWT tokens. You can generate one [here](https://www.grc.com/passwords.htm). Defaults to `dqSRHqsruH3U75hFSg1Y5LCOcON7G90iXGomYbaFuH4G10f2PIexSes3QlyidLC`.
6. Run `MyMoney.exe`
7. MyMoney will be available at http://localhost:5000 (https://localhost:5001 when SSL is enabled)