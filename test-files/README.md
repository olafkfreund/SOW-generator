# Test Files for SOW Generator

This directory contains sample project requirement files that you can use to test the SOW (Statement of Work) generator functionality.

## Available Test Files

### 1. **sample-project.md** 📱
**Project Type:** Enterprise Web Application Development  
**File Format:** Markdown (.md)  
**Description:** A comprehensive requirements document for developing a modern web application with React/TypeScript frontend, Node.js backend, and AWS deployment.

**Key Features:**
- Detailed technical requirements
- Team structure and timeline
- Success criteria and risk factors
- Budget range: $150,000 - $200,000

---

### 2. **mobile-app-requirements.txt** 📱
**Project Type:** Cross-Platform Mobile App Development  
**File Format:** Plain Text (.txt)  
**Description:** Requirements for an e-commerce mobile application using React Native.

**Key Features:**
- Cross-platform iOS/Android development
- E-commerce functionality
- 16-week timeline
- Success metrics and KPIs

---

### 3. **data-platform-spec.md** 📊
**Project Type:** Data Analytics Platform  
**File Format:** Markdown (.md)  
**Description:** Comprehensive specification for building a data analytics and business intelligence platform.

**Key Features:**
- Big data processing capabilities
- Machine learning integration
- Real-time analytics
- 32-week implementation plan

---

### 4. **api-development.txt** 🔌
**Project Type:** API Development and Integration  
**File Format:** Plain Text (.txt)  
**Description:** Requirements for developing a RESTful API system with third-party integrations.

**Key Features:**
- Microservices architecture
- Multiple third-party integrations
- Comprehensive security implementation
- 14-week timeline

---

### 5. **cloud-migration-project.txt** ☁️
**Project Type:** Cloud Migration and Modernization  
**File Format:** Plain Text (.txt)  
**Description:** Project specification for migrating on-premises infrastructure to cloud platform.

**Key Features:**
- Multi-phase migration approach
- Application modernization
- DevOps implementation
- 40-week timeline

## How to Use These Files

1. **Start the Development Server:**
   ```bash
   just dev
   ```

2. **Open the SOW Generator:**
   - Navigate to `http://localhost:3000` in your browser
   - Click on the SOW Generator section

3. **Upload a Test File:**
   - Click "Choose File" in the file upload section
   - Select one of the test files from this directory
   - Click "Generate SOW"

4. **Review the Generated SOW:**
   - The system will process your uploaded file
   - A formatted SOW will be generated and displayed
   - Use the export buttons to download as PDF or DOCX

## File Format Support

The SOW generator accepts the following file formats:
- ✅ `.txt` - Plain text files
- ✅ `.md` - Markdown files  
- ✅ `.docx` - Microsoft Word documents
- ✅ `.pdf` - PDF documents

## Testing Different Scenarios

Each test file represents a different type of project and complexity level:

- **Simple Projects:** mobile-app-requirements.txt, api-development.txt
- **Complex Projects:** data-platform-spec.md, sample-project.md
- **Enterprise Projects:** cloud-migration-project.txt

Try uploading different files to see how the SOW generator handles various project types, formats, and complexity levels.

## Expected Output

The generated SOW should include:
- Executive summary
- Project scope and objectives
- Technical requirements
- Timeline and milestones
- Resource requirements
- Risk assessment
- Success criteria
- Pricing estimation (based on configured rates)

## Troubleshooting

If you encounter issues:

1. **File Upload Fails:** Ensure the file is under 10MB and in a supported format
2. **Generation Takes Too Long:** Complex documents may take longer to process
3. **No Output Generated:** Check the browser console for errors
4. **Backend Issues:** Ensure the backend server is running on port 5000

## Next Steps

After testing with these files, you can:
- Create your own project requirement files
- Modify existing test files to match your specific needs
- Test the management dashboard features (engineers, calendar, pricing)
- Explore the export functionality (PDF/DOCX)
