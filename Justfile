# Justfile for SOW Template Service

set shell := ["zsh", "-cu"]

# Backend
backend-install:
	npm --prefix backend install

backend-build:
	npm --prefix backend run build

backend-dev:
	npm --prefix backend run dev

backend-test:
	npm --prefix backend test

# Frontend
frontend-install:
	npm --prefix frontend install

frontend-build:
	npm --prefix frontend run build

frontend-dev:
	npm --prefix frontend start

frontend-test:
	npm --prefix frontend test -- --watchAll=false

frontend-test-watch:
	npm --prefix frontend test

# Docker
build-docker-backend:
	docker build -f deployment/Dockerfile.backend -t sow-backend:latest .

build-docker-frontend:
	docker build -f deployment/Dockerfile.frontend -t sow-frontend:latest .

build-docker-ollama-amd:
	docker build -f deployment/Dockerfile.ollama.amd -t ollama-amd:latest .

build-docker-ollama-nvidia:
	docker build -f deployment/Dockerfile.ollama.nvidia -t ollama-nvidia:latest .

build-docker-ollama-intel:
	docker build -f deployment/Dockerfile.ollama.intel -t ollama-intel:latest .

# Kubernetes
k8s-apply:
	kubectl apply -f deployment/k8s-pod.yaml

k8s-deploy-intel:
    kubectl apply -f deployment/ollama-intel-deployment.yaml

# All
install:
	just backend-install frontend-install

build:
	just backend-build frontend-build

test:
	just backend-test frontend-test

run:
	just backend-dev & just frontend-dev

# Utilities
create-test-files:
	@echo "📁 Test files already created in test-files/ directory:"
	@ls -la test-files/
	@echo "\n🚀 Use these files to test the SOW generator:"
	@echo "  • sample-project.md - Enterprise web app development"
	@echo "  • mobile-app-requirements.txt - Mobile app project"
	@echo "  • data-platform-spec.md - Data analytics platform"
	@echo "  • api-development.txt - API integration project"
	@echo "  • cloud-migration-project.txt - Cloud migration project"

# Test files
list-test-files:
	@echo "📋 Available Test Files for SOW Generator:"
	@echo ""
	@echo "1. 📱 sample-project.md - Enterprise Web App (Complex)"
	@echo "   Budget: \$150,000-\$200,000 | Timeline: 12 weeks"
	@echo ""
	@echo "2. 📱 mobile-app-requirements.txt - Mobile App (Medium)"
	@echo "   Cross-platform e-commerce app | Timeline: 16 weeks"
	@echo ""
	@echo "3. 📊 data-platform-spec.md - Data Analytics Platform (Complex)"
	@echo "   Big data processing & ML | Timeline: 32 weeks"
	@echo ""
	@echo "4. 🔌 api-development.txt - API Development (Simple)"
	@echo "   RESTful API with integrations | Timeline: 14 weeks"
	@echo ""
	@echo "5. ☁️ cloud-migration-project.txt - Cloud Migration (Enterprise)"
	@echo "   Infrastructure modernization | Timeline: 40 weeks"
	@echo ""
	@echo "💡 To test: Upload any of these files at http://localhost:3000"

# Display test file content
show-test-file file:
	@echo "📄 Content of {{file}}:"
	@echo "=========================="
	@cat test-files/{{file}}

dev:
	@echo "🚀 Starting SOW Template Service..."
	@echo "📱 Frontend will be available at: http://localhost:3000"
	@echo "🔧 Backend API will be available at: http://localhost:5000"
	@echo "📁 Test files are available in: test-files/"
	@echo ""
	just run
