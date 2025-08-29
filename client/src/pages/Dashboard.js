import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { passwordService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      setLoading(true);
      const response = await passwordService.getAll();
      if (response.success) {
        setPasswords(response.data);
      } else {
        setError('Failed to fetch passwords');
      }
    } catch (err) {
      console.error('Error fetching passwords:', err);
      setError('Error fetching passwords. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      try {
        const response = await passwordService.delete(id);
        if (response.success) {
          setPasswords(passwords.filter(password => password.id !== id));
        } else {
          setError('Failed to delete password');
        }
      } catch (err) {
        console.error('Error deleting password:', err);
        setError('Error deleting password. Please try again.');
      }
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  const filteredPasswords = passwords.filter(password => {
    return (
      password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Passwords</h1>
        <Link
          to="/add-password"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add New Password
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search passwords..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPasswords.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">
            {searchTerm ? 'No passwords match your search.' : 'You have no saved passwords yet.'}
          </p>
          {!searchTerm && (
            <Link
              to="/add-password"
              className="inline-block mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Add your first password
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPasswords.map((password) => (
            <div key={password.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-indigo-600 text-white px-4 py-2">
                <h3 className="font-bold truncate">{password.title}</h3>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-gray-600 font-semibold">Username/Email:</span>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-800 mr-2 truncate flex-grow">{password.username}</span>
                    <button
                      onClick={() => copyToClipboard(password.username)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Copy to clipboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-gray-600 font-semibold">Password:</span>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-800 mr-2 truncate flex-grow">
                      {showPassword[password.id] ? password.password : '••••••••••••'}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(password.id)}
                      className="text-indigo-600 hover:text-indigo-800 mr-2"
                      title={showPassword[password.id] ? 'Hide password' : 'Show password'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword[password.id] ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                      </svg>
                    </button>
                    <button
                      onClick={() => copyToClipboard(password.password)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Copy to clipboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>
                {password.notes && (
                  <div className="mb-4">
                    <span className="text-gray-600 font-semibold">Notes:</span>
                    <p className="text-gray-800 mt-1 text-sm">{password.notes}</p>
                  </div>
                )}
                <div className="flex justify-between mt-4">
                  <Link
                    to={`/edit-password/${password.id}`}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold py-1 px-3 rounded text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(password.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-1 px-3 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;