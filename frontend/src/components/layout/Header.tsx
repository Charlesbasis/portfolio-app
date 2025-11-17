'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      await logout();
      
      // Close mobile menu if open
      setIsMenuOpen(false);
      
      // Redirect to home page
      router.push('/');
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Even if logout fails, clear local state and redirect
      router.push('/');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className={`text-2xl font-bold transition-colors ${
              isScrolled ? 'text-blue-200' : 'text-blue-600'
            }`}
          >
            Portfolio
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold transition-colors ${
                  pathname === link.href
                    ? isScrolled
                      ? 'text-blue-200'
                      : 'text-blue-600'
                    : isScrolled
                    ? 'text-gray-200 hover:text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  <User size={20} />
                  <span className="font-semibold">{user?.name}</span>
                </div>
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isScrolled
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isScrolled
                      ? 'border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600'
                      : 'border-2 border-white/30 text-white hover:border-red-500 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    isScrolled
                      ? 'bg-green-600 text-white hover:bg-blue-700'
                      : 'bg-white text-green-600 hover:bg-blue-50'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    isScrolled
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 font-medium ${
                    pathname === link.href
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700 py-2">
                      <User size={20} />
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:border-red-500 hover:text-red-600"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center border-2 border-blue-600 text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
