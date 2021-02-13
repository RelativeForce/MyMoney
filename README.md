# MyMoney

Welcome to MyMoney, a simple money management website written by Joshua Eddy. MyMoney is built using ASP.Net Core 3.1 with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.0.

## Issue process
If you would like a new feature to be added please create a new feature issue.

## Local production setup 
Follow these steps to install and start a local instance of MyMoney.

1. Download and install SQL Server Express [here](https://www.microsoft.com/en-gb/sql-server/sql-server-downloads)
2. Go to the latest release of the app [here](https://github.com/RelativeForce/MyMoney/releases/latest)
3. Download `MyMoney.exe`
4. Move `MyMoney.exe` to the folder you would like app to run from
5. Set up environment variables
6. Run `MyMoney.exe`
7. MyMoney will be available at http://localhost:5000 (https://localhost:5001 when SSL is enabled)

## Environment variables
| Name | Description | Default value | Optional |
|---|---|---|---|
| `MyMoney_Email_Smtp_Server_URL` | The url of the SMTP email server. |   | no |
| `MyMoney_Email_Smtp_Server_Port` | The port number of the SMTP email server. |  | no |
| `MyMoney_Email_Smtp_Server_SSL` | Whether or not to use SSL for requests to SMTP email server. | `true` | yes |
| `MyMoney_Email_Address` | The email address of the account the site will use to send emails. |  | no |
| `MyMoney_Email_Password` | The password of the account the site will use to send emails. |  | no |
| `MyMoney_Database_Connection` | The connection string to the database. Defaults to the local SQL express server instance. | `Server=.\SQLEXPRESS; Initial Catalog=MyMoney; Trusted_Connection=True; MultipleActiveResultSets=true; Integrated Security=True` | yes |
| `MyMoney_Database_Engine` | The database type of the connection. Only `MySQL` and `SQLServer` are supported. | `SQLServer` | yes |
| `MyMoney_Local_Web_App_Path` | The folder path you would like to install the app into. | `.\Web` | yes |
| `MyMoney_GitHub_URL` | The URL to the public GitHub repository. | `https://github.com/RelativeForce/MyMoney` | yes |
| `MyMoney_Asset_File_Name` | The filename of the asset to download. Requires `{0}` Major version number, `{1}` Minor version number and `{2}` Hotfix number. | `MyMoney_win64_{0}-{1}-{2}.zip` | yes |
| `MyMoney_Token_Secret` | The secret used for generating the user JWT tokens. You can generate one [here](https://www.grc.com/passwords.htm). | `dqSRHqsruH3U75hFSg1Y5LCOcON7G90iXGomYbaFuH4G10f2PIexSes3QlyidLC` | yes |
