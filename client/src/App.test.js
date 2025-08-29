import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

// Mock the AuthContext to control authentication state
jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    loading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    handleGoogleCallback: jest.fn()
  })
}));

// Basic test to verify App renders without crashing
test('renders App component without crashing', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
});

// Test that the login page is accessible
test('renders login page when navigating to /login', () => {
  window.history.pushState({}, 'Login Page', '/login');
  
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
  
  // Check for login page elements
  const loginText = screen.getByText(/sign in to your account/i);
  expect(loginText).toBeInTheDocument();
});

// Test that the register page is accessible
test('renders register page when navigating to /register', () => {
  window.history.pushState({}, 'Register Page', '/register');
  
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
  
  // Check for register page elements
  const registerText = screen.getByText(/create an account/i);
  expect(registerText).toBeInTheDocument();
});