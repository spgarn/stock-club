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
VALUES ('61426a20-8d42-4d98-9840-d0a25a7dadda', 'b45a178f-a774-41f2-9542-815171312762');

INSERT INTO "Club" ("Name") VALUES ('Testklubben');
INSERT INTO "ApplicationUserClub" ("ClubsId", "UsersId") VALUES (1, '61426a20-8d42-4d98-9840-d0a25a7dadda');
```
