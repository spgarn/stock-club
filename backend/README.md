## Migrations

dotnet ef migrations add InitialCreate
dotnet ef database update

## Run

docker-compose up --build

## Add Admin

```sql
SELECT * FROM "AspNetRoles";

SELECT * FROM "AspNetUsers";

INSERT INTO "AspNetRoles" ("Id", "Name", "NormalizedName")
VALUES (gen_random_uuid(), 'Admin', 'ADMIN');

SELECT "Id" FROM "AspNetRoles" WHERE "Name" = 'Admin';

INSERT INTO "AspNetUserRoles" ("UserId", "RoleId")
VALUES ('50e23fff-a859-4882-996b-07bfcfb68067', '98f5d408-75b0-4d72-abd8-07deaff74246');

INSERT INTO "Club" ("Name") VALUES ('Aktieklubben');
INSERT INTO "ApplicationUserClub" ("ClubsId", "UsersId") VALUES (1, '50e23fff-a859-4882-996b-07bfcfb68067');
```
