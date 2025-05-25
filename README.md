# SOW Template Service

## Status

✅ **READY FOR DEPLOYMENT** - All build issues resolved!

### Recent Fixes
- ✅ Fixed missing `react-markdown` dependency in frontend
- ✅ Added missing TypeScript types (`@types/file-saver`, `@types/pdfmake`)
- ✅ Resolved pdfmake font configuration issues
- ✅ Cleaned up unused imports
- ✅ All builds (local and Docker) now working

## Overview
A web service to generate Statement of Work (SOW) documents for Azure, GCP, and AWS deployments using Retrieval-Augmented Generation (RAG) powered by Ollama. Includes engineer management, time off calendar, and price list. Supports Markdown preview and export to PDF/DOCX.

## Setup

### Backend
```
cd backend
npm install
npm run dev
```

### Frontend
```
cd frontend
npm install
npm start
```

### Deployment
See `deployment/README.md` for Docker and Kubernetes instructions.

## API Endpoints
- `POST /api/sow/generate` - Generate SOW from uploaded document
- `GET/POST /api/engineers` - Manage engineers
- `GET/POST /api/calendar` - Manage engineer time off
- `GET/POST /api/pricing` - Manage price list

## Features
- SOW creation wizard
- Markdown preview
- Export to PDF/DOCX
- Engineer/calendar/price list management

## Testing
- Backend: `npm test` (Jest, to be implemented)
- Frontend: `npm test` (React Testing Library)

## License
MIT
