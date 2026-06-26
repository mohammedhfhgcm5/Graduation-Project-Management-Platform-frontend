# Graduation Project Management Platform Frontend

React + Vite frontend for a graduation project and scientific research management platform.

## Features

- Role-based dashboards for `STUDENT`, `SUPERVISOR`, and `HEAD`
- Authentication with JWT
- Project proposal creation and status tracking
- File uploads for proposals, reports, final files, and presentations
- Progress reports
- Comments and meeting scheduling
- Notifications
- Arabic and English UI with RTL/LTR support

## Tech Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- Redux Toolkit

## Requirements

- Node.js 18+
- The NestJS backend running on `http://localhost:3000`

## Environment Variables

Create `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-unsigned-upload-preset
VITE_CLOUDINARY_FOLDER=graduation-projects
```

`VITE_CLOUDINARY_UPLOAD_PRESET` must be an unsigned Cloudinary upload preset. Do not put your Cloudinary API secret in frontend environment variables.

## Run Locally

```bash
npm install
npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
```

## Quality Checks

```bash
npm run lint
```

## Notes

- Uploaded files are sent directly from the browser to Cloudinary. The backend should store the returned Cloudinary URL and metadata, not the file bytes.
- The UI now matches the current NestJS backend routes for projects, files, reports, comments, meetings, and notifications.
