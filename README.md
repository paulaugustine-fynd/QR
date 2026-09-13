# Fynd QR

A Fynd-branded QR generator for internal teams.

## Features

- Create direct-link QR codes with no scan limits
- Create downloadable vCard contact QR codes
- Fynd logo embedded in every QR
- Custom QR colours and high-resolution PNG downloads
- Device-local QR library
- Access restricted to `@gofynd.com` and `@fynd.com` email addresses
- Multi-link QR is currently marked as coming soon

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

The project is a standard Next.js app and can be imported directly into Vercel. No environment variables are required for this local-storage version.
