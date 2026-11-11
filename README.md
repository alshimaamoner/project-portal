# Project Portal

A Vite React TypeScript portal with nested declarative React Router routes, Context authentication, generic auth/loading HOCs, project filters in the URL, and lazy admin settings. Plain CSS; no state or UI libraries. TypeScript strict mode is enabled.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Sign in as `sara` (admin) or `youssef` (member). No password is required. The supplied mock API delays each request by 700 ms and randomly fails 20% of requests; retry a failed request or submit the login again.

```sh
npm test
npm run build
npm run preview
```

Tests run once with Vitest, React Testing Library, jsdom, and MemoryRouter. Production hosting must serve `index.html` for unknown paths so direct nested-route visits work.

## Routes

- `/`: Home
- `/login`: Login
- `/dashboard`: Overview with project counts
- `/dashboard/projects`: Searchable, status-filtered projects
- `/dashboard/projects/:projectId`: Project details
- `/dashboard/settings`: Admin-only compact-list preference
- Other URLs: Not found

The root header is shared by all pages; dashboard children share a sidebar and Outlet. Session and compact preference are saved locally with guarded storage access. This mock sign-in and browser-local role check demonstrate UI routing only; a production service would enforce authentication and authorization on the server.

## Starter transcription

The supplied types and API are copied with formatting only, omitting the document's `C2 General` page markers. The API's `2027-0131` date is preserved; the presentation formatter normalizes that value to January 31, 2027 before using Intl.DateTimeFormat. All other data, latency, and failure behavior are preserved.

The ten Part 1 MCQ answers are in [ANSWERS.md](ANSWERS.md). Public repository publication still requires a repository destination and account access.

See [NOTES.md](NOTES.md) for architecture explanations.

## Verification in this workspace

The latest verification passed all 10 automated tests (`npm test`) and the production build (`npm run build`). ESLint also passes (`npm run lint`). The tests cover login redirect-back, role restrictions, unknown routes, Retry, URL filters, corrupted sessions, stale responses, and loading-prop forwarding.

All ten MCQ answers and the implementation have been reviewed against the pasted assignment brief. The starter files match the pasted code apart from formatting; use the original source files if an exact byte comparison is required. Manual browser verification remains outstanding.

If installation fails with npm's `Cannot read properties of null (reading 'edgesOut')` error, try `npm install --legacy-peer-deps`, then rerun the build and tests.

## Before submission

- Compare all ten answers in `ANSWERS.md` with the original questions.
- Compare `src/types.ts` and `src/api/mockApi.ts` with the supplied originals.
- Review the four responses in `NOTES.md` and explain them in your own words.
- While signed out, open `/dashboard/projects?q=mobile&status=active`, sign in, and confirm that you return to the filtered list.
- Reload the filtered list and confirm that the session and both filters remain.
- Sign in as `youssef` and open `/dashboard/settings` directly; confirm access is restricted. Repeat as `sara` and confirm Settings opens.
- Open `/missing/page` and confirm the Not found page appears.
- Run `npm test` and `npm run build` after the final changes.
- Publish the project to a public GitHub repository and submit its URL.
