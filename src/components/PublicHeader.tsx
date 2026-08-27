import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageDropdown from '@/components/LanguageDropdown';
import { Menu, X } from 'lucide-react';

const PublicHeader = () => {
  const navigate = useNavigate();
  const { tSync } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-medtronic text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-3xl font-bold">
              <span className="text-white">MiniMed</span>
              <span className="text-xs align-super">™</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-white/90 hover:text-white transition-colors font-medium">
              {tSync('nav.products')}
            </Link>
            <Link to="/support" className="text-white/90 hover:text-white transition-colors font-medium">
              {tSync('nav.support')}
            </Link>
            <Link to="/healthcare" className="text-white/90 hover:text-white transition-colors font-medium">
              {tSync('nav.healthcare')}
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <LanguageDropdown className="hidden md:flex" />

            <Button
              onClick={() => navigate('/auth')}
              className="hidden md:inline-flex bg-white text-medtronic-deepPurple hover:bg-gray-100 font-semibold px-6"
            >
              {tSync('nav.signin')}
            </Button>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            <Link to="/products" className="block py-2 text-gray-600">
              {tSync('nav.products')}
            </Link>
            <Link to="/support" className="block py-2 text-gray-600">
              {tSync('nav.support')}
            </Link>
            <Link to="/healthcare" className="block py-2 text-gray-600">
              {tSync('nav.healthcare')}
            </Link>
            <div className="py-2">
              <LanguageDropdown variant="mobile" />
            </div>
            <Button
              variant="medical"
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              {tSync('nav.signin')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
