import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ClientHeader: React.FC = () => {
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
          <Link to="/client" className="text-2xl font-bold text-blue-400">
            CryptoBoost Client
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/client" className="hover:text-blue-300 transition-colors">
              Dashboard
            </Link>
            <Link to="/client/profile" className="hover:text-blue-300 transition-colors">
              Profil
            </Link>
            <Link to="/client/investments" className="hover:text-blue-300 transition-colors">
              Investissements
            </Link>
            <Link to="/client/transactions" className="hover:text-blue-300 transition-colors">
              Transactions
            </Link>
            <Link to="/client/wallets" className="hover:text-blue-300 transition-colors">
              Wallets
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm">Bonjour, {user?.email || 'Utilisateur'}</span>
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