import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Document, Packer, Paragraph } from 'docx';
import { saveAs } from 'file-saver';
import './SowGenerator.css';

const SowGenerator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysis(null); // Reset analysis when file changes
      setMarkdown(''); // Reset SOW when file changes
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a document to analyze.');
      return;
    }

    setError('');
    setAnalyzing(true);
    
    const formData = new FormData();
    formData.append('document', file);
    
    try {
      console.log('Analyzing document...');
      const response = await fetch('/api/sow/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const analysisData = await response.json();
      console.log('Analysis completed:', analysisData);
      setAnalysis(analysisData);
    } catch (err: any) {
      console.error('Analysis Error:', err);
      setError(err.message || 'An error occurred while analyzing the document');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMarkdown('');
    
    if (!file) {
      setError('Please select a document to upload.');
      return;
    }
    
    console.log('Starting SOW generation...', { fileName: file.name, fileSize: file.size });
    setLoading(true);
    
    const formData = new FormData();
    formData.append('document', file);
    
    try {
      console.log('Sending request to /api/sow/generate...');
      const response = await fetch('/api/sow/generate', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Response received:', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Server error response:', errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('SOW generated successfully, markdown length:', data.markdown?.length);
      setMarkdown(data.markdown);
    } catch (err: any) {
      console.error('SOW Generation Error:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Cannot connect to the backend service. Please ensure the backend is running on port 4000.');
      } else {
        setError(err.message || 'An error occurred while generating the SOW');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!markdown) return;
    // Dynamically import pdfmake only when needed
    const pdfMake = (await import('pdfmake/build/pdfmake')).default;
    const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default;
    (pdfMake as any).vfs = (pdfFonts as any).vfs;
    const docDefinition: any = {
      content: [
        { text: 'Generated SOW', style: 'header' },
        { text: '', margin: [0, 10] },
        { text: markdown }
      ],
      styles: {
        header: { fontSize: 18, bold: true }
      }
    };
    pdfMake.createPdf(docDefinition).download('sow.pdf');
  };

  const handleExportDOCX = async () => {
    if (!markdown) return;
    const paragraphs = markdown.split('\n').map(line => new Paragraph(line));
    const doc = new Document({
      sections: [{ properties: {}, children: paragraphs }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'sow.docx');
  };

  return (
    <div className="sow-generator">
      <div className="sow-generator-header">
        <h1 className="sow-generator-title">📋 SOW Generator</h1>
        <p className="sow-generator-subtitle">
          Upload your project requirements and generate a professional Statement of Work
        </p>
      </div>

      <div className="upload-section">
        <form onSubmit={handleSubmit}>
          <div className="upload-area" onClick={() => document.getElementById('file-input')?.click()}>
            <div className="upload-icon">📁</div>
            <h3 className="upload-title">
              {file ? 'File Selected' : 'Choose Project File'}
            </h3>
            <p className="upload-subtitle">
              Supports .txt, .md, .docx, and .pdf files
            </p>
            <input
              id="file-input"
              type="file"
              accept=".txt,.md,.docx,.pdf"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
          
          {file && (
            <div className="file-info">
              <div className="file-icon">📄</div>
              <div className="file-details">
                <div className="file-name">{file.name}</div>
                <div className="file-size">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
              <button
                type="button"
                className="remove-file"
                onClick={() => {
                  setFile(null);
                  setAnalysis(null);
                  setMarkdown('');
                  setError('');
                }}
              >
                ✕
              </button>
            </div>
          )}

          {file && !analysis && (
            <div className="analyze-section">
              <button 
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing} 
                className={`analyze-button ${analyzing ? 'loading' : ''}`}
              >
                {analyzing ? 'Analyzing Document...' : '🔍 Analyze Project Requirements'}
              </button>
              <p className="analyze-subtitle">
                Get platform detection and complexity analysis before generating your SOW
              </p>
            </div>
          )}

          {analysis && (
            <div className="analysis-results">
              <div className="analysis-header">
                <h3>📊 Project Analysis Results</h3>
              </div>
              
              <div className="analysis-grid">
                <div className="analysis-card platform-card">
                  <h4>☁️ Detected Cloud Platform</h4>
                  <div className="platform-result">
                    <span className={`platform-badge ${analysis.platform.detected.toLowerCase()}`}>
                      {analysis.platform.detected}
                    </span>
                  </div>
                  <div className="platform-scores">
                    <div className="score-item">
                      <span>AWS: {analysis.platform.scores.aws}</span>
                    </div>
                    <div className="score-item">
                      <span>Azure: {analysis.platform.scores.azure}</span>
                    </div>
                    <div className="score-item">
                      <span>GCP: {analysis.platform.scores.gcp}</span>
                    </div>
                  </div>
                </div>

                <div className="analysis-card project-card">
                  <h4>📈 Project Complexity</h4>
                  <div className="complexity-result">
                    <span className={`size-badge ${analysis.project.size.toLowerCase()}`}>
                      {analysis.project.size}
                    </span>
                    <div className="complexity-score">
                      Score: {analysis.project.complexity}/12
                    </div>
                  </div>
                  <div className="estimates">
                    <div className="estimate-item">
                      <span>⏱️ Timeline: {analysis.project.estimatedWeeks} weeks</span>
                    </div>
                    <div className="estimate-item">
                      <span>💰 Investment: {analysis.project.estimatedCost}</span>
                    </div>
                  </div>
                </div>

                <div className="analysis-card document-card">
                  <h4>📄 Document Info</h4>
                  <div className="document-stats">
                    <div className="stat-item">
                      <span>Size: {(analysis.document.size / 1000).toFixed(1)}K chars</span>
                    </div>
                    <div className="stat-item">
                      <span>Words: {analysis.document.wordCount.toLocaleString()}</span>
                    </div>
                  </div>
                  {analysis.project.indicators.length > 0 && (
                    <div className="complexity-indicators">
                      <h5>Complexity Indicators:</h5>
                      <div className="indicator-tags">
                        {analysis.project.indicators.map((indicator: string) => (
                          <span key={indicator} className="indicator-tag">
                            {indicator}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="generate-section">
            <button 
              type="submit" 
              disabled={!file || loading || !analysis} 
              className={`generate-button ${loading ? 'loading' : ''} ${!analysis ? 'disabled' : ''}`}
            >
              {loading ? 'Generating SOW...' : '🚀 Generate SOW'}
            </button>
            {file && !analysis && (
              <p className="generate-hint">
                Analyze your document first to see platform detection and complexity analysis
              </p>
            )}
          </div>
        </form>
      </div>

      {error && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-title">Generation Failed</div>
          <div className="error-message">{error}</div>
        </div>
      )}

      {markdown && (
        <div className="sow-output">
          <div className="sow-output-header">
            <div className="sow-output-title">
              <span>📋</span>
              Generated Statement of Work
            </div>
            <div className="export-buttons">
              <button 
                onClick={handleExportPDF} 
                className="export-button pdf"
              >
                📄 Export PDF
              </button>
              <button 
                onClick={handleExportDOCX} 
                className="export-button docx"
              >
                📝 Export DOCX
              </button>
            </div>
          </div>
          <div className="sow-content">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default SowGenerator;
