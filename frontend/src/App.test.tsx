import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SOW Generator heading', () => {
  render(<App />);
  const heading = screen.getByText(/SOW Generator/i);
  expect(heading).toBeInTheDocument();
});

test('renders Management Dashboard heading', () => {
  render(<App />);
  const heading = screen.getByText(/Management Dashboard/i);
  expect(heading).toBeInTheDocument();
});
