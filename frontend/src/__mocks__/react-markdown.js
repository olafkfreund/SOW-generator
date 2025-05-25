// Mock for react-markdown component
import React from 'react';

const ReactMarkdown = ({ children }) => {
  return React.createElement('div', { 'data-testid': 'mock-markdown' }, children);
};

export default ReactMarkdown;
