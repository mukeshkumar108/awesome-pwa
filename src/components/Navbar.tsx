import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = (
    <>
      <li><Link to="/dashboard" className="btn btn-ghost">Dashboard</Link></li>
      <li><Link to="/profile" className="btn btn-ghost">Profile</Link></li>
      {user ? (
        <li className="flex items-center">
          <button onClick={handleLogout} className="btn btn-ghost text-red-400">Sign Out</button>
        </li>
      ) : (
        <li><Link to="/login" className="btn btn-ghost">Sign In</Link></li>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 rounded-box m-2">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl rounded-btn">
          Awesome PWA
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="flex-none hidden lg:flex">
        <ul className="menu menu-horizontal rounded-box gap-1">
          {menuItems}
        </ul>
      </div>

      {/* Mobile Menu (Hamburger) */}
      <div className="flex-none lg:hidden">
        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
          <GiHamburgerMenu className="inline-block h-5 w-5" />
        </label>
      </div>

      {/* User profile section */}
      {user && (
        <div className="flex-none hidden lg:block ml-4">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-neutral flex items-center justify-center text-white">
                <FaUserCircle className="w-8 h-8"/>
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleLogout}>Sign Out</button></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
