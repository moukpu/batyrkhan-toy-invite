# Batyrkhan Toy Invite

Premium bilingual invitation website for Batyrkhan's `Сүндет тойы · Тілашар`, built with Next.js, Tailwind CSS, Framer Motion, PostgreSQL, and a Telegram RSVP bot.

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- TypeScript
- Framer Motion
- PostgreSQL
- Telegram Bot API

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in the browser.

If you only want to preview the UI locally without a database, set this in `.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK_RSVP=true
```

If you want to use the real RSVP backend locally, provide `DATABASE_URL` in `.env.local`.

## Production build

```bash
npm run build
npm run start
```

## Database

Prepare the RSVP table with:

```bash
npm run db:migrate
```

The project uses one PostgreSQL table named `rsvps` and updates existing responses by normalized guest name.

## Telegram bot

Run the Telegram worker with:

```bash
npm run bot
```

Required environment variables:

- `DATABASE_URL`
- `TELEGRAM_BOT_TOKEN`

Supported commands:

- `/start`
- `/list`
- `/yes`
- `/no`
- `/latest`
- `/stats`

## Railway deployment

1. Push this repository to GitHub.
2. Create a Railway Postgres database in the project.
3. Add `DATABASE_URL` to the web service and the bot worker.
4. Add `TELEGRAM_BOT_TOKEN` to the bot worker.
5. Create the web service from this repository with:
   - Build: `npm run build`
   - Start: `npm run start`
6. Create a second Railway worker/service from the same repository with:
   - Build: `npm run build`
   - Start: `npm run bot`
7. Run `npm run db:migrate` once after attaching the database, or let the first RSVP submission or bot startup initialize the table automatically.

## Notes

- Default language is Kazakh, with a built-in Kazakh/Russian switcher.
- Venue button opens the exact 2GIS destination configured in `src/lib/event-data.ts`.
- Guest answers are not exposed publicly on the website.
