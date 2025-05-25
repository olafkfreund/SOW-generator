import React, { useState } from 'react';
import './App.css';
import SowGenerator from './SowGenerator';
import ManagementDashboard from './ManagementDashboard';

function App() {
  const [activeTab, setActiveTab] = useState<'sow' | 'management'>('sow');

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="app-logo">
            📋 SOW Template Service
          </div>
          <div className="status-indicator status-success">
            <span>🟢</span>
            Service Running
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'sow' ? 'active' : ''}`}
            onClick={() => setActiveTab('sow')}
          >
            <span className="section-icon">📄</span>
            SOW Generator
          </button>
          <button
            className={`nav-tab ${activeTab === 'management' ? 'active' : ''}`}
            onClick={() => setActiveTab('management')}
          >
            <span className="section-icon">⚙️</span>
            Management Dashboard
          </button>
        </nav>

        {/* Content Sections */}
        {activeTab === 'sow' && (
          <div className="content-section animate-fade-in">
            <SowGenerator />
          </div>
        )}

        {activeTab === 'management' && (
          <div className="content-section animate-fade-in">
            <ManagementDashboard />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
