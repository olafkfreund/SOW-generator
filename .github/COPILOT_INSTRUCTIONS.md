# Copilot Instructions for SOW Template Service

## General

- Use clear, modular code with comments for all major functions/classes.
- Prefer TypeScript for backend and frontend with strict type checking.
- Follow RESTful API conventions with proper HTTP status codes.
- All endpoints must validate input and handle errors gracefully with detailed logging.
- Use environment variables for configuration (OLLAMA_URL, OLLAMA_MODEL, ports).
- Implement proper error boundaries and loading states in the UI.

## Backend (Node.js + Express + TypeScript)

- Organize code by feature modules (`/sow`, `/engineers`, `/calendar`, `/pricing`).
- Use async/await for all I/O operations and external API calls.
- Integrate with Ollama via HTTP API (default: `http://localhost:11434`).
- Support multi-GPU environments (AMD, Nvidia, Intel) via environment configuration.
- Store all business data in Markdown files under `backend/content/` for easy RAG integration.
- Serve engineers, calendar, pricing, and SOW templates as structured Markdown via REST endpoints.
- Use `multer` for file uploads with proper validation and `axios` for HTTP requests.
- Implement comprehensive logging with console.log for development and debugging.
- Provide `/api/sow/analyze` endpoint for project analysis before generation.
- Include cloud platform detection logic (Azure, AWS, GCP) with service-specific keywords.
- Add cost estimation based on project complexity scoring (1-12 scale).
- Support file formats: `.txt`, `.md`, `.docx`, `.pdf` for document uploads.

## Frontend (React 18 + TypeScript + Modern CSS)

- Use React 18 with TypeScript and modern hooks (useState, useEffect, useCallback).
- Implement Gruvbox dark theme with CSS custom properties for consistent styling.
- Provide tabbed interface with SOW Generator and Management Dashboard.
- Include real-time Markdown editing and preview using `react-markdown`.
- Support export to PDF (`pdfmake`) and DOCX (`docx`) with proper document formatting.
- Implement file upload with drag-and-drop support and progress indicators.
- Use proxy configuration in package.json for development API calls to backend.
- Fetch all data (engineers, calendar, pricing, templates) from backend Markdown endpoints.
- Include project analysis display before SOW generation with platform detection.
- Implement proper loading states, error handling, and user feedback.
- Use CSS Grid and Flexbox for responsive layouts that work on mobile and desktop.

## RAG Integration & AI

- Use Ollama with `llama3` model as the primary LLM backend.
- Enhanced prompt engineering for comprehensive SOW generation with:
  - Executive summaries and project objectives
  - Technical architecture recommendations
  - Resource allocation and timeline estimation
  - Risk assessment and mitigation strategies
  - Cloud platform-specific best practices
  - Detailed deliverables and success criteria
- Retrieval corpus includes project documents and all Markdown files in `backend/content/`.
- Implement intelligent context building from uploaded documents and historical data.
- Support platform-specific SOW generation (Azure, AWS, GCP) with tailored recommendations.
- Include complexity analysis and cost estimation in AI-generated content.

## Development Environment & Tools

- Use `devenv.nix` for reproducible NixOS development environment with Python support.
- Use `Justfile` for automation with commands:
  - `just install` - Install all dependencies
  - `just build` - Build backend and frontend
  - `just test` - Run all tests (22 total: 6 backend + 16 frontend)
  - `just run` - Start development servers
  - `just build-docker-*` - Build container images
- Include Python environment for potential document processing extensions.
- Set up proper environment variables in devenv for consistent development.

## Deployment & Infrastructure

- Provide production-ready Dockerfiles for all components:
  - `Dockerfile.backend` - Node.js backend with TypeScript compilation
  - `Dockerfile.frontend` - React frontend with Nginx serving
  - `Dockerfile.ollama.amd` - Ubuntu 24.04 + ROCm for AMD GPUs
  - `Dockerfile.ollama.nvidia` - CUDA 12.4 + Ubuntu 24.04 for Nvidia GPUs
  - `Dockerfile.ollama.intel` - OneAPI + OpenVINO for Intel GPUs
- Provide comprehensive Kubernetes manifests with:
  - Security hardening (non-root containers, RBAC, network policies)
  - Resource management and auto-scaling
  - Persistent storage for models and uploads
  - Health checks and monitoring configuration
  - GPU resource allocation and node selection
- Include separate deployment files for different GPU types.
- Implement proper secrets management and ConfigMaps for configuration.

## Testing & Quality Assurance

- Maintain 100% test success rate (current: 22/22 tests passing).
- Use Jest + Supertest for backend API testing with proper mocking.
- Use React Testing Library + Jest for frontend component testing.
- Mock external dependencies (Ollama API, file operations) in tests.
- Include integration tests for complete SOW generation workflow.
- Test file upload, processing, and export functionality.
- Validate Docker builds and Kubernetes deployments in CI/CD.
- Use `userEvent` for proper user interaction simulation in frontend tests.

## Data Management & Content

- Store all business data in Markdown format for easy editing and version control:
  - `engineers.md` - Team profiles with hourly rates and specializations
  - `calendar.md` - Time-off and availability tracking
  - `pricing.md` - Service rates and project estimation guidelines
  - `sow-templates.md` - Pre-built templates for different cloud platforms
- Maintain test files in `test-files/` directory with realistic project scenarios.
- Use structured Markdown with consistent formatting for AI processing.
- Keep content up-to-date with current market rates and team information.

## UI/UX & Styling

- Implement modern Gruvbox dark theme with warm, retro-inspired colors.
- Use CSS custom properties for consistent theming across components.
- Provide responsive design with mobile-first approach.
- Include smooth animations and hover effects for professional feel.
- Implement proper loading indicators and error states.
- Use Inter font for UI text and JetBrains Mono for code/technical content.
- Follow accessibility best practices with proper contrast and focus management.

## Documentation & API

- Maintain comprehensive README with setup, usage, and deployment instructions.
- Document all API endpoints with curl examples and response formats.
- Include troubleshooting guides for common deployment issues.
- Provide Kubernetes deployment guides for different GPU configurations.
- Keep project plan updated with current implementation status.
- Use clear Markdown formatting with proper headers and code blocks.

## Security & Production Considerations

- Run all containers as non-root users with minimal privileges.
- Implement proper input validation and sanitization.
- Use read-only root filesystems where possible.
- Configure proper network policies and RBAC in Kubernetes.
- Include health checks and monitoring endpoints.
- Implement proper error handling without exposing sensitive information.
- Use environment variables for all configuration (no hardcoded values).

## Code Quality Standards

- Use TypeScript strict mode with proper type definitions.
- Implement comprehensive error handling with meaningful messages.
- Follow consistent naming conventions (camelCase for variables, PascalCase for components).
- Include JSDoc comments for complex functions and API endpoints.
- Use modern JavaScript/TypeScript features (async/await, destructuring, optional chaining).
- Maintain clean separation of concerns between components and services.
