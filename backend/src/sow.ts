import { Router, Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Helper to read Markdown file content
function readMarkdownFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

// POST /api/sow/generate - Upload a document and generate a SOW using RAG (Ollama)
router.post('/generate', upload.single('document'), async (req: Request, res: Response) => {
  try {
    console.log('SOW generation request received');
    const file = req.file;
    if (!file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No document uploaded' });
    }
    
    console.log(`File uploaded: ${file.originalname}, size: ${file.size} bytes`);
    
    // Read uploaded document
    const docContent = fs.readFileSync(file.path, 'utf-8');
    console.log(`Document content length: ${docContent.length} characters`);
    
    // Prepare RAG request to Ollama
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama3';
    
    console.log(`Connecting to Ollama at: ${ollamaUrl}, model: ${ollamaModel}`);
    
    // Analyze document for cloud platform preferences and complexity
    const docLower = docContent.toLowerCase();
    
    // Enhanced cloud platform detection with service-specific keywords
    const gcpServices = ['bigquery', 'vertex ai', 'cloud storage', 'cloud dataflow', 'cloud pub/sub', 
                         'cloud functions', 'gke', 'google kubernetes engine', 'cloud sql', 
                         'cloud memorystore', 'looker', 'data studio', 'cloud build', 'firebase'];
    const azureServices = ['azure sql', 'azure storage', 'azure functions', 'aks', 'azure devops',
                          'power bi', 'azure monitor', 'azure active directory', 'cosmos db'];
    const awsServices = ['s3', 'ec2', 'rds', 'lambda', 'cloudformation', 'cloudwatch', 'iam', 'eks'];
    
    const gcpScore = gcpServices.filter(service => docLower.includes(service)).length;
    const azureScore = azureServices.filter(service => docLower.includes(service)).length;
    const awsScore = awsServices.filter(service => docLower.includes(service)).length;
    
    // Also check for general platform mentions
    const gcpMentions = (docLower.match(/\bgcp\b/g) || []).length + 
                       (docLower.match(/google cloud/g) || []).length;
    const azureMentions = (docLower.match(/\bazure\b/g) || []).length + 
                         (docLower.match(/microsoft azure/g) || []).length;
    const awsMentions = (docLower.match(/\baws\b/g) || []).length + 
                       (docLower.match(/amazon web services/g) || []).length;
    
    const totalGcpScore = gcpScore * 2 + gcpMentions;
    const totalAzureScore = azureScore * 2 + azureMentions;
    const totalAwsScore = awsScore * 2 + awsMentions;
    
    let preferredCloud = 'AWS'; // Default
    if (totalGcpScore > totalAzureScore && totalGcpScore > totalAwsScore) {
      preferredCloud = 'GCP';
    } else if (totalAzureScore > totalAwsScore && totalAzureScore > totalGcpScore) {
      preferredCloud = 'Azure';
    }
    
    // Estimate project complexity
    const complexityIndicators = [
      'migration', 'microservices', 'kubernetes', 'enterprise', 'legacy',
      'compliance', 'multi-region', 'high availability', 'disaster recovery',
      'ci/cd', 'devops', 'security audit', 'performance optimization'
    ];
    const complexityScore = complexityIndicators.filter(indicator => 
      docLower.includes(indicator)
    ).length;
    
    let projectSize = 'Small';
    let estimatedWeeks = '4-8';
    let estimatedCost = '$25,000 - $75,000';
    
    if (complexityScore >= 6) {
      projectSize = 'Enterprise';
      estimatedWeeks = '16-32';
      estimatedCost = '$150,000 - $500,000';
    } else if (complexityScore >= 3) {
      projectSize = 'Medium';
      estimatedWeeks = '8-16';
      estimatedCost = '$75,000 - $200,000';
    }
    
    console.log(`Platform detection scores: GCP=${totalGcpScore}, Azure=${totalAzureScore}, AWS=${totalAwsScore}`);
    console.log(`Project analysis: Platform=${preferredCloud}, Size=${projectSize}, Complexity=${complexityScore}`);
    
    // Read existing content for context
    const sowTemplates = readMarkdownFile('backend/content/sow-templates.md');
    const engineers = readMarkdownFile('backend/content/engineers.md');
    const pricing = readMarkdownFile('backend/content/pricing.md');
    
    // Enhanced RAG prompt for comprehensive SOW generation
    const ragPrompt = `You are an expert consultant specializing in cloud migrations and infrastructure deployments for AWS, Azure, and GCP. Based on the uploaded project requirements document, generate a comprehensive Statement of Work (SOW) in Markdown format.

UPLOADED PROJECT REQUIREMENTS:
${docContent}

ANALYSIS RESULTS:
- Preferred Cloud Platform: ${preferredCloud}
- Project Size: ${projectSize}
- Estimated Timeline: ${estimatedWeeks} weeks
- Estimated Investment: ${estimatedCost}
- Complexity Score: ${complexityScore}/12

CONTEXT AND TEMPLATES:
${sowTemplates}

AVAILABLE TEAM:
${engineers}

PRICING REFERENCE:
${pricing}

Generate a detailed, professional SOW specifically tailored for ${preferredCloud} that includes:

## 1. EXECUTIVE SUMMARY
- Clear project overview and business objectives aligned with ${preferredCloud} capabilities
- Expected outcomes and ROI quantification
- High-level timeline (${estimatedWeeks} weeks) and investment (${estimatedCost})
- Strategic benefits of choosing ${preferredCloud}

## 2. PROJECT SCOPE & OBJECTIVES
- Detailed technical requirements analysis
- ${preferredCloud} platform selection rationale with specific service recommendations
- Architecture design principles following ${preferredCloud} best practices
- Performance and scalability targets using ${preferredCloud} metrics
- Security and compliance requirements specific to ${preferredCloud}

## 3. ${preferredCloud} SOLUTION ARCHITECTURE
- Detailed ${preferredCloud} services selection and justification
- Specific ${preferredCloud} architecture patterns and reference architectures
- Integration points using ${preferredCloud} native services
- ${preferredCloud} security services and compliance frameworks
- ${preferredCloud} disaster recovery and backup strategies

## 4. ${preferredCloud} METHODOLOGY & BEST PRACTICES
- ${preferredCloud} Well-Architected Framework principles
- ${preferredCloud} DevOps and Infrastructure as Code tools (CloudFormation/ARM/Terraform)
- ${preferredCloud} security best practices and compliance guidelines
- Agile project management with ${preferredCloud} cloud adoption methodology
- Risk mitigation using ${preferredCloud} native monitoring and alerting

## 5. DETAILED DELIVERABLES
- Phase-by-phase breakdown with ${preferredCloud}-specific milestones
- ${preferredCloud} Infrastructure as Code templates and deployment scripts
- ${preferredCloud} native documentation and operational runbooks
- ${preferredCloud} training materials and certification paths
- ${preferredCloud} cost optimization and governance frameworks

## 6. TEAM COMPOSITION & RESPONSIBILITIES
- Team structure with ${preferredCloud}-certified professionals
- Specific ${preferredCloud} skills and expertise requirements
- ${preferredCloud} support escalation procedures
- Client team collaboration using ${preferredCloud} collaboration tools

## 7. CUSTOMER REQUIREMENTS & RESPONSIBILITIES
- Pre-project ${preferredCloud} account setup and access requirements
- ${preferredCloud} permissions and IAM configuration needs
- Data preparation and migration readiness for ${preferredCloud}
- Stakeholder availability for ${preferredCloud} decision points
- ${preferredCloud} compliance and security approval processes

## 8. PROJECT TIMELINE & MILESTONES
- Detailed ${estimatedWeeks}-week project phases optimized for ${preferredCloud}
- ${preferredCloud} service provisioning and configuration milestones
- Go/no-go decision points aligned with ${preferredCloud} best practices
- ${preferredCloud} testing and validation checkpoints

## 9. INVESTMENT & COMMERCIAL TERMS
- Detailed cost breakdown: ${estimatedCost} professional services
- ${preferredCloud} infrastructure cost estimates by service
- Team member allocation with ${preferredCloud} expertise premiums
- ${preferredCloud} licensing and support costs
- Payment schedule aligned with ${preferredCloud} delivery milestones

## 10. ${preferredCloud} RISK ASSESSMENT & MITIGATION
- ${preferredCloud}-specific technical risks and mitigation strategies
- ${preferredCloud} service limitations and workarounds
- ${preferredCloud} cost management and budget controls
- ${preferredCloud} security and compliance risks

## 11. SUCCESS CRITERIA & ACCEPTANCE
- ${preferredCloud} performance benchmarks and KPIs
- ${preferredCloud} cost optimization targets
- ${preferredCloud} security compliance validation
- ${preferredCloud} operational excellence metrics

## 12. POST-DEPLOYMENT ${preferredCloud} SUPPORT
- ${preferredCloud} operational support model and SLAs
- ${preferredCloud} monitoring, alerting, and incident response
- ${preferredCloud} cost optimization and right-sizing recommendations
- ${preferredCloud} roadmap and future enhancement planning

Make the SOW comprehensive, professional, and specifically tailored to ${preferredCloud} best practices. Include specific ${preferredCloud} services, pricing models, and realistic timelines. Demonstrate deep expertise in ${preferredCloud} technologies and provide actionable recommendations. Use proper Markdown formatting with clear headings and bullet points.`;
    
    console.log('Sending enhanced request to Ollama...');
    const ollamaResponse = await axios.post(`${ollamaUrl}/api/generate`, {
      model: ollamaModel,
      prompt: ragPrompt,
      stream: false
    });
    
    console.log('Ollama response received');
    
    // Clean up uploaded file
    fs.unlinkSync(file.path);
    console.log('Temporary file cleaned up');
    
    // Return generated SOW Markdown
    res.json({ markdown: ollamaResponse.data.response });
  } catch (err: any) {
    console.error('SOW generation error:', err.message);
    if (err.code === 'ECONNREFUSED') {
      res.status(503).json({ 
        error: 'AI service unavailable. Please ensure Ollama is running on localhost:11434', 
        details: err.message 
      });
    } else {
      res.status(500).json({ error: 'Failed to generate SOW', details: err.message });
    }
  }
});

// POST /api/sow/analyze - Analyze document and return platform detection and complexity
router.post('/analyze', upload.single('document'), async (req: Request, res: Response) => {
  try {
    console.log('Document analysis request received');
    const file = req.file;
    if (!file) {
      console.log('No file uploaded for analysis');
      return res.status(400).json({ error: 'No document uploaded' });
    }
    
    console.log(`Analyzing file: ${file.originalname}, size: ${file.size} bytes`);
    
    // Read uploaded document
    const docContent = fs.readFileSync(file.path, 'utf-8');
    console.log(`Document content length: ${docContent.length} characters`);
    
    // Enhanced cloud platform detection with service-specific keywords
    const docLower = docContent.toLowerCase();
    
    const gcpServices = ['bigquery', 'vertex ai', 'cloud storage', 'cloud dataflow', 'cloud pub/sub', 
                         'cloud functions', 'gke', 'google kubernetes engine', 'cloud sql', 
                         'cloud memorystore', 'looker', 'data studio', 'cloud build', 'firebase'];
    const azureServices = ['azure sql', 'azure storage', 'azure functions', 'aks', 'azure devops',
                          'power bi', 'azure monitor', 'azure active directory', 'cosmos db'];
    const awsServices = ['s3', 'ec2', 'rds', 'lambda', 'cloudformation', 'cloudwatch', 'iam', 'eks'];
    
    const gcpScore = gcpServices.filter(service => docLower.includes(service)).length;
    const azureScore = azureServices.filter(service => docLower.includes(service)).length;
    const awsScore = awsServices.filter(service => docLower.includes(service)).length;
    
    // Also check for general platform mentions
    const gcpMentions = (docLower.match(/\bgcp\b/g) || []).length + 
                       (docLower.match(/google cloud/g) || []).length;
    const azureMentions = (docLower.match(/\bazure\b/g) || []).length + 
                         (docLower.match(/microsoft azure/g) || []).length;
    const awsMentions = (docLower.match(/\baws\b/g) || []).length + 
                       (docLower.match(/amazon web services/g) || []).length;
    
    const totalGcpScore = gcpScore * 2 + gcpMentions;
    const totalAzureScore = azureScore * 2 + azureMentions;
    const totalAwsScore = awsScore * 2 + awsMentions;
    
    let preferredCloud = 'AWS'; // Default
    if (totalGcpScore > totalAzureScore && totalGcpScore > totalAwsScore) {
      preferredCloud = 'GCP';
    } else if (totalAzureScore > totalAwsScore && totalAzureScore > totalGcpScore) {
      preferredCloud = 'Azure';
    }
    
    // Estimate project complexity
    const complexityIndicators = [
      'migration', 'microservices', 'kubernetes', 'enterprise', 'legacy',
      'compliance', 'multi-region', 'high availability', 'disaster recovery',
      'ci/cd', 'devops', 'security audit', 'performance optimization'
    ];
    const complexityScore = complexityIndicators.filter(indicator => 
      docLower.includes(indicator)
    ).length;
    
    let projectSize = 'Small';
    let estimatedWeeks = '4-8';
    let estimatedCost = '$25,000 - $75,000';
    
    if (complexityScore >= 6) {
      projectSize = 'Enterprise';
      estimatedWeeks = '16-32';
      estimatedCost = '$150,000 - $500,000';
    } else if (complexityScore >= 3) {
      projectSize = 'Medium';
      estimatedWeeks = '8-16';
      estimatedCost = '$75,000 - $200,000';
    }
    
    // Clean up uploaded file
    fs.unlinkSync(file.path);
    
    // Return analysis results
    res.json({
      platform: {
        detected: preferredCloud,
        scores: {
          gcp: totalGcpScore,
          azure: totalAzureScore,
          aws: totalAwsScore
        },
        services: {
          gcp: gcpServices.filter(service => docLower.includes(service)),
          azure: azureServices.filter(service => docLower.includes(service)),
          aws: awsServices.filter(service => docLower.includes(service))
        }
      },
      project: {
        size: projectSize,
        complexity: complexityScore,
        estimatedWeeks,
        estimatedCost,
        indicators: complexityIndicators.filter(indicator => docLower.includes(indicator))
      },
      document: {
        filename: file.originalname,
        size: docContent.length,
        wordCount: docContent.split(/\s+/).length
      }
    });
  } catch (err: any) {
    console.error('Document analysis error:', err.message);
    res.status(500).json({ error: 'Failed to analyze document', details: err.message });
  }
});

// GET /api/engineers - Return engineers.md as Markdown
router.get('/engineers', (req: Request, res: Response) => {
  const md = readMarkdownFile('backend/content/engineers.md');
  res.type('text/markdown').send(md);
});

// GET /api/calendar - Return calendar.md as Markdown
router.get('/calendar', (req: Request, res: Response) => {
  const md = readMarkdownFile('backend/content/calendar.md');
  res.type('text/markdown').send(md);
});

// GET /api/pricing - Return pricing.md as Markdown
router.get('/pricing', (req: Request, res: Response) => {
  const md = readMarkdownFile('backend/content/pricing.md');
  res.type('text/markdown').send(md);
});

// GET /api/sow-templates - Return sow-templates.md as Markdown
router.get('/sow-templates', (req: Request, res: Response) => {
  const md = readMarkdownFile('backend/content/sow-templates.md');
  res.type('text/markdown').send(md);
});

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'SOW API placeholder' });
});

export default router;
