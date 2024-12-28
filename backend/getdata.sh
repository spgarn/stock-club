
dotnet ef dbcontext scaffold "Host=localhost;Database=club;Username=postgres;Password=postgres;Port=5432" Npgsql.EntityFrameworkCore.PostgreSQL -o Models
dotnet ef migrations add Initial