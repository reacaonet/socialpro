import React from 'react';
import Sidebar from '../Navigation/Sidebar';
import AuthNavbar from '../Navigation/AuthNavbar';
import Footer from '../Navigation/Footer';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <Sidebar />
      <main className="lg:pl-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
