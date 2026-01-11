$process = Start-Process -FilePath "npm" -ArgumentList "run", "db:generate" -WorkingDirectory "c:\Project\spring-boot-nextjs-starter-kit" -NoNewWindow -PassThru -Wait
