# Copilot Instructions for SOW Template Service

## General

- Use clear, modular code with comments for all major functions/classes.
- Prefer TypeScript for backend and frontend.
- Use RESTful API conventions.
- All endpoints must validate input and handle errors gracefully.
- Use environment variables for configuration (e.g., Ollama port, GPU type).

## Backend

- Organize code by feature (e.g., /sow, /engineers, /calendar, /pricing).
- Use async/await for all I/O and API calls.
- Integrate with Ollama via HTTP API (configurable port).
- Support both AMD and Nvidia GPU options for Ollama (via env/config).
- Store documents and metadata in Markdown files under `backend/content/` for RAG context.
- Serve engineers, calendar, pricing, and SOW templates as Markdown via API endpoints for easy editing and RAG integration.
- Use `multer` for file uploads and `axios` for HTTP requests.

## Frontend

- Use a modern framework (React + TypeScript).
- Provide Markdown editing and preview for SOWs.
- Support export to PDF and DOCX (use `pdfmake`, `docx`, `marked`, and `file-saver`).
- UI must allow uploading documents, managing engineers, time off, and price list.
- Fetch Markdown data for engineers, calendar, pricing, and SOW templates from backend endpoints.

## RAG Integration

- Use Ollama as the LLM backend for RAG.
- Retrieval corpus is previous project documents and Markdown files in `backend/content/`.
- Allow user to select which documents to include in RAG context.

## Deployment

- Provide Dockerfiles for backend, frontend, and Ollama (AMD/Nvidia variants).
- Provide Kubernetes Pod/Deployment spec with configurable Ollama port and GPU type.
- Use `devenv.nix` for NixOS development environment setup.
- Use `Justfile` for build, test, and run automation.

## Testing

- Write unit and integration tests for all modules.
- Use environment variables for test configuration.
- Use Jest and Supertest for backend, React Testing Library for frontend.

## Documentation

- Document all endpoints, config options, and deployment steps in Markdown.
- Keep Markdown data files in `backend/content/` up to date for RAG and business logic.
