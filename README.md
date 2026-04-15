# Batyrkhan Toy Invite

Premium bilingual invitation website for Batyrkhan's `Сүндет той · Тілашар`, built with Next.js, Tailwind CSS, and Framer Motion.

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- TypeScript
- Framer Motion

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in the browser.

## Production build

```bash
npm run build
npm run start
```

## Railway deployment

1. Push this repository to GitHub.
2. Create a new Railway project from the GitHub repo.
3. Railway will detect the Next.js app automatically.
4. Use the default commands:
   - Build: `npm run build`
   - Start: `npm run start`
5. Deploy.

## Notes

- Default language is Kazakh, with a built-in Kazakh/Russian switcher.
- Venue button opens the exact 2GIS destination configured in `src/lib/event-data.ts`.
