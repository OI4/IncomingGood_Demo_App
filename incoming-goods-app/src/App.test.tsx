import { render, screen } from '@testing-library/react';
import App from './App';
import { BackendService } from './Services/BackendService';

test('renders learn react link', () => {
const backendService = new BackendService();

  render(<App backendService={backendService}/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
