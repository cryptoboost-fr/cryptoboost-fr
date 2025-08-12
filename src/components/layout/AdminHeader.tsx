import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/admin" className="text-2xl font-bold text-red-400">
            CryptoBoost Admin
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/admin" className="hover:text-red-300 transition-colors">
              Dashboard
            </Link>
            <Link to="/admin/users" className="hover:text-red-300 transition-colors">
              Utilisateurs
            </Link>
            <Link to="/admin/transactions" className="hover:text-red-300 transition-colors">
              Transactions
            </Link>
            <Link to="/admin/investments" className="hover:text-red-300 transition-colors">
              Investissements
            </Link>
            <Link to="/admin/logs" className="hover:text-red-300 transition-colors">
              Logs
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm">Admin: {user?.email || 'Administrateur'}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};