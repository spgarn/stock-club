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
VALUES ('0a6440b5-d2a8-468c-852d-07ad926ec6ce', '1798a063-6527-45e7-9028-a750c103060d');

INSERT INTO "Club" ("Name") VALUES ('Testklubben');
INSERT INTO "ApplicationUserClub" ("ClubsId", "UsersId") VALUES (1, '0a6440b5-d2a8-468c-852d-07ad926ec6ce');
```
