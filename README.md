# SOW Template Service 📄

A sophisticated **Statement of Work (SOW) Template Service** powered by **Retrieval-Augmented Generation (RAG)** using Ollama. This service intelligently generates professional SOWs for cloud deployment projects across Azure, AWS, and GCP by analyzing uploaded project documents and leveraging historical project data.

## 🚀 Project Overview

The SOW Template Service revolutionizes how consulting teams create professional statements of work. By combining AI-powered document analysis with curated templates and pricing data, it automatically generates comprehensive SOWs that include:

- **Intelligent Cloud Platform Detection** (Azure, AWS, GCP)
- **Project Complexity Analysis** and sizing recommendations
- **Automated Resource Planning** with engineer assignments
- **Cost Estimation** based on project scope and timeline
- **Best Practice Integration** for chosen cloud platforms
- **Professional Export Options** (PDF, DOCX, Markdown)

## 🏗️ Architecture & Components

### **Core Technologies**

- **Backend**: Node.js + TypeScript + Express.js
- **Frontend**: React 18 + TypeScript + Modern CSS (Gruvbox Theme)
- **AI/RAG Engine**: Ollama (llama3 model) with configurable GPU support
- **Document Processing**: Multer for uploads, Markdown parsing
- **Export Capabilities**: PDF generation (pdfmake), DOCX creation
- **Development Environment**: NixOS devenv, Justfile automation
- **Containerization**: Docker + Kubernetes deployment

### **Key Features**

- **📊 Project Analysis**: Automatic detection of cloud platform preferences and complexity scoring
- **🤖 AI-Powered Generation**: RAG-based SOW creation using historical project data
- **👥 Team Management**: Engineer profiles with hourly rates and availability calendar
- **💰 Dynamic Pricing**: Intelligent cost estimation based on project requirements
- **🎨 Modern UI**: Professional interface with Gruvbox dark theme
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices
- **🔄 Real-time Preview**: Live Markdown editing and preview capabilities

## 🛠️ Setup & Installation

### **Prerequisites**

- Node.js 18+ and npm
- Docker (for containerized deployment)
- Ollama with llama3 model
- NixOS (optional, for devenv)

### **Quick Start**

1. **Clone the repository:**

```bash
git clone https://github.com/olafkfreund/SOW-generator.git
cd SOW-generator
```

2. **Using NixOS devenv (recommended):**

```bash
nix develop
just install
just build
just run
```

3. **Manual setup:**

```bash
# Install dependencies
npm --prefix backend install
npm --prefix frontend install

# Build projects
npm --prefix backend run build
npm --prefix frontend run build

# Start development servers
npm --prefix backend run dev &
npm --prefix frontend start
```

4. **Start Ollama (if not running):**

```bash
ollama serve --port 11434
ollama pull llama3
```

5. **Access the application:**

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:4000>

## 📡 API Documentation

### **SOW Generation**

#### **Analyze Project Document**

```bash
curl -X POST http://localhost:4000/api/sow/analyze \
  -F "document=@test-files/sample-project.md" \
  -H "Content-Type: multipart/form-data"
```

**Response:**

```json
{
  "detectedPlatform": "Azure",
  "projectSize": "Enterprise",
  "complexity": 8,
  "estimatedDuration": "24-32 weeks",
  "recommendedTeamSize": "8-12 engineers",
  "keyServices": ["Azure Kubernetes Service", "Azure SQL Database", "Azure DevOps"]
}
```

#### **Generate Complete SOW**

```bash
curl -X POST http://localhost:4000/api/sow/generate \
  -F "document=@test-files/cloud-migration-project.txt" \
  -H "Content-Type: multipart/form-data"
```

**Response:**

```json
{
  "sow": "# Statement of Work: Enterprise Cloud Migration\n\n## Executive Summary...",
  "analysis": {
    "platform": "AWS",
    "complexity": 7,
    "estimatedCost": "$180,000-$250,000"
  }
}
```

### **Data Management**

#### **Get Engineers List**

```bash
curl http://localhost:4000/api/engineers
```

#### **Get Time-Off Calendar**

```bash
curl http://localhost:4000/api/calendar
```

#### **Get Pricing Information**

```bash
curl http://localhost:4000/api/pricing
```

#### **Get SOW Templates**

```bash
curl http://localhost:4000/api/sow-templates
```

### **Example Upload with Analysis**

```bash
# Upload and analyze a complex project
curl -X POST http://localhost:4000/api/sow/analyze \
  -F "document=@test-files/data-platform-spec.md" \
  -H "Content-Type: multipart/form-data" \
  | jq '.'

# Generate full SOW for the same project
curl -X POST http://localhost:4000/api/sow/generate \
  -F "document=@test-files/data-platform-spec.md" \
  -H "Content-Type: multipart/form-data" \
  | jq '.sow' -r
```

## 🧪 Testing

### **Run All Tests**

```bash
just test                    # Run both backend and frontend tests
just backend-test           # Backend only (6 tests)
just frontend-test          # Frontend only (16 tests)
```

### **Test SOW Generation**

```bash
# Test with provided sample files
just show-test-file sample-project.md
curl -X POST http://localhost:4000/api/sow/generate \
  -F "document=@test-files/sample-project.md"
```

### **Available Test Files**

- `sample-project.md` - Enterprise web application (Complex)
- `mobile-app-requirements.txt` - Cross-platform mobile app (Medium)
- `data-platform-spec.md` - Big data analytics platform (Complex)
- `api-development.txt` - RESTful API development (Simple)
- `cloud-migration-project.txt` - Infrastructure migration (Enterprise)

## 🐳 Docker Deployment

### **Build Images**

```bash
just build-docker-backend      # Build backend container
just build-docker-frontend     # Build frontend container
just build-docker-ollama-amd   # Build Ollama with AMD GPU support
just build-docker-ollama-nvidia # Build Ollama with Nvidia GPU support
```

### **Kubernetes Deployment**

```bash
just k8s-apply                # Deploy to Kubernetes cluster
kubectl get pods             # Check deployment status
```

## 📊 Project Components

### **Backend Services**

- **Express.js API Server** - RESTful endpoints for SOW operations
- **Multer File Upload** - Handles document uploads (txt, md, docx, pdf)
- **Ollama Integration** - RAG-powered SOW generation using llama3
- **Content Management** - Markdown-based data storage for engineers, pricing, templates

### **Frontend Application**

- **React Components** - Modern UI for SOW creation and management
- **Markdown Editor** - Live preview and editing capabilities
- **Export Functionality** - PDF and DOCX generation using pdfmake and docx libraries
- **Management Dashboard** - Engineer, calendar, and pricing administration

### **Data & Templates**

- **Engineer Profiles** - 13 team members with hourly rates and specializations
- **Time-Off Calendar** - Team availability tracking
- **Pricing Models** - Service rates and project estimation guidelines
- **SOW Templates** - Pre-built templates for Azure, AWS, and GCP projects

### **Development Tools**

- **Justfile Automation** - Build, test, and deployment commands
- **NixOS devenv** - Reproducible development environment
- **TypeScript** - Type safety across frontend and backend
- **Jest Testing** - Comprehensive test suites (22 tests total)

## 🎯 Usage Examples

### **Generate SOW for Azure Project**

1. Upload project requirements document
2. System detects Azure services and complexity
3. AI generates comprehensive SOW with:
   - Executive summary and project objectives
   - Technical architecture recommendations
   - Resource allocation and timeline
   - Risk assessment and mitigation strategies
   - Detailed pricing breakdown

### **Team Management**

- View engineer profiles with specializations and hourly rates
- Check team availability calendar
- Manage pricing for different service types
- Update SOW templates for different cloud platforms

### **Export Options**

- **Markdown**: Edit and version control
- **PDF**: Professional client presentation
- **DOCX**: Further customization in Word

## 🔧 Configuration

### **Environment Variables**

```bash
OLLAMA_URL=http://localhost:11434    # Ollama API endpoint
OLLAMA_MODEL=llama3                  # AI model for SOW generation
PORT=4000                           # Backend server port
```

### **Ollama Setup**

```bash
# Install and configure Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve --port 11434
ollama pull llama3
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`just test`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is part of a consulting SOW template system designed for professional cloud deployment projects.

---

**Built with ❤️ using modern web technologies and AI-powered document generation.**
