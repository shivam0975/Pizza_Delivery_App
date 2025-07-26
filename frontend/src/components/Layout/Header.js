//This file frovides the header for application containing navigation links

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-gray-900 text-white relative z-10 px-6 py-4 shadow-md flex justify-between items-center">
      <div className="text-xl font-semibold">
        <Link to="/" className="hover:text-yellow-400 transition">Pizza App</Link>
      </div>

      <nav className="space-x-4 text-sm">
        {user ? (
          <>
            <span className="text-gray-300">Hello, {user.name}</span>
            {user.isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="hover:text-yellow-400 transition"
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/inventory"
                  className="hover:text-yellow-400 transition"
                >
                  Add Inventory
                </Link>
              </>
            )}
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-yellow-400 transition">
              Login
            </Link>
            <span className="text-gray-500">|</span>
            <Link to="/register" className="hover:text-yellow-400 transition">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
