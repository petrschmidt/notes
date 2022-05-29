# UHK FIM (OWE) Semestral Project - Notes App

Live Demo: https://uhk-fim-owe-notes-app.netlify.app

## How to run the application

1. First install dependencies:

```
yarn
```

2. Then set environment variables:

```env
# .env / .env.development

DATABASE_URL=<PlanetScale database URL>
SHADOW_DATABASE_URL=<PlanetScale shadow database URL (for migrations)>
JWT_SECRET=<JSONWebToken secret>

SESSION_COOKIE_NAME=<session cookie name>
SESSION_COOKIE_PASSWORD=<session cookie password>
```

3. Start the app:

```bash
npm run dev
# or
yarn dev
```

4. When in development, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

