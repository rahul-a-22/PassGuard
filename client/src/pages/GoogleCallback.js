import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallback = () => {
  const [error, setError] = useState('');
  const { handleGoogleCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processCallback = () => {
      try {
        // Get token from URL query params
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token) {
          setError('No authentication token received');
          return;
        }

        // Process the token
        const success = handleGoogleCallback(token);

        if (success) {
          navigate('/');
        } else {
          setError('Failed to authenticate with Google');
        }
      } catch (err) {
        console.error('Google callback error:', err);
        setError('An error occurred during Google authentication');
      }
    };

    processCallback();
  }, [location, handleGoogleCallback, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md w-full" role="alert">
          <p className="font-bold">Authentication Error</p>
          <p>{error}</p>
          <div className="mt-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Return to Login
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-lg">Authenticating with Google...</p>
        </div>
      )}
    </div>
  );
};

export default GoogleCallback;