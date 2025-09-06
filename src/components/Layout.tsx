import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow p-4 md:p-8 pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
