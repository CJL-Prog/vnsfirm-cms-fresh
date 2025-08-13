// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app with loading state initially', () => {
  render(<App />);
  const loadingElement = screen.getByText(/loading/i);
  expect(loadingElement).toBeInTheDocument();
});