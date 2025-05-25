#!/usr/bin/env python3
"""
Simple script to generate a PDF test file for the SOW generator.
Requires: pip install reportlab
"""

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    import os

    def create_test_pdf():
        # Create the test-files directory if it doesn't exist
        os.makedirs('/home/olafkfreund/Source/SOW-templates/test-files', exist_ok=True)
        
        # Create PDF
        doc = SimpleDocTemplate(
            '/home/olafkfreund/Source/SOW-templates/test-files/cloud-migration-project.pdf',
            pagesize=letter
        )
        
        # Get styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=1  # Center alignment
        )
        
        # Build content
        content = []
        
        # Title
        content.append(Paragraph("Cloud Migration and Modernization Project", title_style))
        content.append(Spacer(1, 20))
        
        # Project Overview
        content.append(Paragraph("<b>Project Overview</b>", styles['Heading2']))
        overview_text = """
        This project involves migrating our on-premises infrastructure to a modern cloud platform 
        while modernizing legacy applications for improved scalability, performance, and cost efficiency.
        The migration will be executed in phases to minimize business disruption.
        """
        content.append(Paragraph(overview_text, styles['Normal']))
        content.append(Spacer(1, 12))
        
        # Objectives
        content.append(Paragraph("<b>Key Objectives</b>", styles['Heading2']))
        objectives = [
            "Migrate 50+ applications to AWS cloud infrastructure",
            "Modernize legacy monolithic applications to microservices",
            "Implement DevOps practices and CI/CD pipelines",
            "Reduce infrastructure costs by 30-40%",
            "Improve application performance and scalability",
            "Enhance security posture with cloud-native security services"
        ]
        
        for obj in objectives:
            content.append(Paragraph(f"• {obj}", styles['Normal']))
        content.append(Spacer(1, 12))
        
        # Technical Approach
        content.append(Paragraph("<b>Technical Approach</b>", styles['Heading2']))
        approach_text = """
        <b>Assessment Phase:</b> Comprehensive analysis of current infrastructure, applications, 
        and dependencies. Performance baseline establishment and cloud readiness assessment.<br/><br/>
        
        <b>Migration Strategy:</b> Lift-and-shift for compatible applications, re-architecting 
        for critical business applications, and retirement of legacy systems.<br/><br/>
        
        <b>Modernization:</b> Containerization with Docker and Kubernetes, microservices 
        architecture implementation, and API-first design principles.<br/><br/>
        
        <b>Security:</b> Implementation of Zero Trust security model, encryption at rest 
        and in transit, and compliance with industry standards.
        """
        content.append(Paragraph(approach_text, styles['Normal']))
        content.append(Spacer(1, 12))
        
        # Timeline
        content.append(Paragraph("<b>Project Timeline</b>", styles['Heading2']))
        timeline_text = """
        <b>Phase 1 (Weeks 1-6):</b> Assessment, planning, and cloud environment setup<br/>
        <b>Phase 2 (Weeks 7-18):</b> Infrastructure migration and basic application deployment<br/>
        <b>Phase 3 (Weeks 19-30):</b> Application modernization and optimization<br/>
        <b>Phase 4 (Weeks 31-36):</b> Testing, optimization, and go-live preparation<br/>
        <b>Phase 5 (Weeks 37-40):</b> Final migration, validation, and knowledge transfer
        """
        content.append(Paragraph(timeline_text, styles['Normal']))
        content.append(Spacer(1, 12))
        
        # Success Metrics
        content.append(Paragraph("<b>Success Metrics</b>", styles['Heading2']))
        metrics = [
            "Zero data loss during migration",
            "Application downtime less than 4 hours per service",
            "30% reduction in infrastructure operational costs",
            "50% improvement in deployment frequency",
            "99.9% application availability post-migration",
            "Complete compliance with security and regulatory requirements"
        ]
        
        for metric in metrics:
            content.append(Paragraph(f"• {metric}", styles['Normal']))
        
        # Build PDF
        doc.build(content)
        print("✅ PDF test file created: /home/olafkfreund/Source/SOW-templates/test-files/cloud-migration-project.pdf")

    if __name__ == "__main__":
        create_test_pdf()

except ImportError:
    print("❌ reportlab not installed. Install with: pip install reportlab")
    print("Creating a simple text file instead...")
    
    # Fallback: create a simple text file with similar content
    content = """Cloud Migration and Modernization Project

Project Overview:
This project involves migrating our on-premises infrastructure to a modern cloud platform 
while modernizing legacy applications for improved scalability, performance, and cost efficiency.
The migration will be executed in phases to minimize business disruption.

Key Objectives:
• Migrate 50+ applications to AWS cloud infrastructure
• Modernize legacy monolithic applications to microservices
• Implement DevOps practices and CI/CD pipelines
• Reduce infrastructure costs by 30-40%
• Improve application performance and scalability
• Enhance security posture with cloud-native security services

Technical Approach:
Assessment Phase: Comprehensive analysis of current infrastructure, applications, 
and dependencies. Performance baseline establishment and cloud readiness assessment.

Migration Strategy: Lift-and-shift for compatible applications, re-architecting 
for critical business applications, and retirement of legacy systems.

Modernization: Containerization with Docker and Kubernetes, microservices 
architecture implementation, and API-first design principles.

Security: Implementation of Zero Trust security model, encryption at rest 
and in transit, and compliance with industry standards.

Project Timeline:
Phase 1 (Weeks 1-6): Assessment, planning, and cloud environment setup
Phase 2 (Weeks 7-18): Infrastructure migration and basic application deployment
Phase 3 (Weeks 19-30): Application modernization and optimization
Phase 4 (Weeks 31-36): Testing, optimization, and go-live preparation
Phase 5 (Weeks 37-40): Final migration, validation, and knowledge transfer

Success Metrics:
• Zero data loss during migration
• Application downtime less than 4 hours per service
• 30% reduction in infrastructure operational costs
• 50% improvement in deployment frequency
• 99.9% application availability post-migration
• Complete compliance with security and regulatory requirements"""

    with open('/home/olafkfreund/Source/SOW-templates/test-files/cloud-migration-fallback.txt', 'w') as f:
        f.write(content)
    print("✅ Text fallback file created: cloud-migration-fallback.txt")
