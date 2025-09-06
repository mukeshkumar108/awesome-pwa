import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const NavLinks = () => (
    <>
      <Link
        to="/dashboard"
        className="text-lg font-medium text-foreground hover:text-primary transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Dashboard
      </Link>
      <Link
        to="/profile"
        className="text-lg font-medium text-foreground hover:text-primary transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Profile
      </Link>
      {user ? (
        <Button
          variant="ghost"
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 justify-start h-auto p-0"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      ) : (
        <Link
          to="/login"
          className="text-lg font-medium text-foreground hover:text-primary transition-colors"
          onClick={() => setIsOpen(false)}
        >
          Sign In
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            Awesome PWA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLinks />
          </div>

          {/* User Avatar - Desktop */}
          {user && (
            <div className="hidden lg:flex items-center ml-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-6 mt-8 px-4">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
