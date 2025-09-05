import React, { useState } from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    // We use a drawer for the mobile menu on small screens
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 
      <div className="drawer-content flex flex-col">
        {/* Main content of the page goes here, navigated by the Outlet */}
        <Navbar />
        <main className="flex-grow p-4 md:p-8">
          <Outlet />
        </main>
      </div> 
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label> 
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          {/* Sidebar content here */}
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Layout;
