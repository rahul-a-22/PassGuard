import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">PassGuard</Link>
        
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/" className="hover:text-indigo-200 transition-colors">
                Dashboard
              </Link>
              <Link to="/add-password" className="hover:text-indigo-200 transition-colors">
                Add Password
              </Link>
              <button 
                onClick={handleLogout}
                className="hover:text-indigo-200 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-200 transition-colors">
                Login
              </Link>
              <Link to="/register" className="hover:text-indigo-200 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;