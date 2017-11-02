 IF NOT EXIST (SELECT name FROM sys.server_principals WHERE name = 'IIS APPPOOL\DefaultAppPool')
BEGIN
   CREATE LOGIN [IIS APPPOOL\DefaultAppPool]
     FROM WINDOWS WITH DEFAULT_DATABASE=[master],
     DEFAULT_LANGUAGE=[us_english]
END
GO
CREATE USER [Lv-171.Net]
   FOR LOGIN [IIS APPPOOL\DefaultAppPool]
GO
EXEC sp_addrolemember 'db_owner', 'Lv-171.Net'
GO