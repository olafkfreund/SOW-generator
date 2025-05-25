# Project Plan: SOW Template Service with RAG and Ollama

## Overview

A web service to generate Statement of Work (SOW) documents for Azure, GCP, and AWS deployments using Retrieval-Augmented Generation (RAG) powered by Ollama. The service leverages previous project documents, manages engineers and their time off, and maintains a price list. Users can upload documents to generate new SOWs, preview in Markdown, and export as PDF or DOCX. The service is containerized to run in a pod, with Ollama on a configurable port and support for AMD/Nvidia GPUs.

## Architecture

- **Frontend**: Web UI for SOW creation, preview, and export (Markdown, PDF, DOCX)
- **Backend**: REST API for document management, RAG integration, engineer/calendar/pricing management
- **RAG Engine**: Ollama (local, non-standard port, AMD/Nvidia GPU support)
- **Storage**: Document and metadata storage (local or cloud, to be defined)
- **Deployment**: Docker, Kubernetes Pod spec

## Components & Steps

1. **Backend API**
   - Document upload & management
   - RAG integration with Ollama (configurable port, GPU selection)
   - SOW template generation (Azure, GCP, AWS)
   - Engineer list & time off calendar endpoints
   - Price list management endpoints
2. **Frontend**
   - SOW creation wizard (select template, upload doc, preview, edit)
   - Markdown editor & preview
   - Export to PDF/DOCX
   - Engineer/calendar/price list management UI
3. **RAG Integration**
   - Connect to Ollama API (local, non-standard port)
   - Use previous project docs as retrieval corpus
   - Option to select AMD/Nvidia GPU for Ollama
4. **Deployment**
   - Dockerfile for backend/frontend
   - Dockerfile for Ollama (AMD/Nvidia variants)
   - Kubernetes Pod/Deployment spec
5. **Testing & Documentation**
   - Unit/integration tests
   - Usage documentation

## Milestones

1. Project scaffolding & instructions
2. Backend API skeleton
3. Frontend skeleton
4. RAG/Ollama integration
5. Engineer/calendar/pricing modules
6. Export features (PDF/DOCX)
7. Deployment (Docker/K8s)
8. Testing & docs
