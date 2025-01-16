import React from 'react';
import AuthNavbar from '../Navigation/AuthNavbar';
import Sidebar from '../Navigation/Sidebar';
import Footer from '../Navigation/Footer';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <Sidebar />
      
      {/* Main Content */}
      <div className="pl-64 pt-16"> {/* Ajustado para o espaço da Sidebar e Navbar */}
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
