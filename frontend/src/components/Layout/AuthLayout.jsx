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
        <div className="w-[90%] mx-auto py-6">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
