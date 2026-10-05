# NovaNest Venture

NovaNest is maintained as a single monorepo. The repository contains the
Next.js frontend, the Django API, and one root Docker Compose definition that
starts the complete application stack.

## Repository layout

```text
.
|-- frontend/       Next.js application and its Dockerfile
|-- backend/        Django application and its Dockerfile
|-- compose.yaml    Frontend, backend, and MySQL orchestration
|-- .env.example    Documented environment variables
`-- .github/        CI workflows
```

The source from both original repositories is consolidated here. The release
ZIP intentionally excludes Git metadata and local development artifacts.

## Run the full stack

1. Copy `.env.example` to `.env`.
2. Replace the development passwords and `DJANGO_SECRET_KEY` in `.env`.
3. Build and start all services:

   ```bash
   docker compose up -d --build
   ```

The frontend is available at <http://localhost:3000> and the Django API at
<http://localhost:8000>.

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose down
```

## Persistent data

MySQL data is stored in the named volume `novanest_mysql_data`. Uploaded Django
media is stored in `novanest_backend_media`. A normal `docker compose down`, a
container restart, or an image rebuild does not delete either volume.

Do not run `docker compose down --volumes` unless you intentionally want to
delete the project data. Back up the database before destructive maintenance.
The volume names can be changed with `DB_VOLUME_NAME` and `MEDIA_VOLUME_NAME`
in `.env`.

The old backend configuration used SQLite even though its Compose file started
MySQL. If an existing deployment has real data in `db.sqlite3`, export and
import that data before switching the deployment to this MySQL-based stack.

## Configuration notes

- `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_DJANGO_HOST_URL` are compiled into the
  frontend image. Rebuild the frontend after changing them.
- Set `DJANGO_DEBUG=false`, a strong `DJANGO_SECRET_KEY`, production hosts, and
  production CORS/CSRF origins before deployment.
- Email variables are optional locally but must be configured for email flows
  in production.
