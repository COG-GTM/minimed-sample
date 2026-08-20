import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageDropdown from '@/components/LanguageDropdown';
import { 
  Activity, 
  Shield, 
  Smartphone, 
  Share2, 
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const { tSync } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Activity,
      title: tSync('features.monitoring'),
      description: 'Track glucose levels continuously with advanced CGM integration'
    },
    {
      icon: Shield,
      title: tSync('features.delivery'),
      description: 'Smart insulin delivery that adapts to your body\'s needs'
    },
    {
      icon: Share2,
      title: tSync('features.sharing'),
      description: 'Share real-time data with your healthcare team'
    },
    {
      icon: Smartphone,
      title: tSync('features.mobile'),
      description: 'Stay connected with mobile app integration'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-medtronic text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="text-3xl font-bold">
                <span className="text-white">MiniMed</span>
                <span className="text-xs align-super">™</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#products" className="text-white/90 hover:text-white transition-colors font-medium">
                {tSync('nav.products')}
              </a>
              <a href="#support" className="text-white/90 hover:text-white transition-colors font-medium">
                {tSync('nav.support')}
              </a>
              <a href="#healthcare" className="text-white/90 hover:text-white transition-colors font-medium">
                {tSync('nav.healthcare')}
              </a>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Language Dropdown */}
              <LanguageDropdown className="hidden md:flex" />

              {/* Sign In Button */}
              <Button 
                onClick={() => navigate('/auth')}
                className="hidden md:inline-flex bg-white text-medtronic-deepPurple hover:bg-gray-100 font-semibold px-6"
              >
                {tSync('nav.signin')}
              </Button>

              {/* Mobile Menu Button */}
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
              <a href="#products" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600">
                {tSync('nav.products')}
              </a>
              <a href="#support" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600">
                {tSync('nav.support')}
              </a>
              <a href="#healthcare" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600">
                {tSync('nav.healthcare')}
              </a>
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

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-minimed scroll-mt-20">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <img src="/minimed-logo.svg" alt="MiniMed" className="h-12" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-medtronic-deepPurple leading-tight">
                {tSync('hero.title')}
              </h1>
              <p className="text-xl text-medtronic-purple">
                {tSync('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="bg-medtronic-brightBlue hover:bg-blue-600 text-white text-lg px-8 py-6 rounded-full font-semibold"
                >
                  {tSync('hero.cta')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-full border-2 border-medtronic-deepPurple text-medtronic-deepPurple hover:bg-medtronic-deepPurple hover:text-white"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-white/50 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-medtronic-brightBlue to-medtronic-skyBlue rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Activity className="h-16 w-16 text-white" />
                  </div>
                  <p className="text-2xl font-semibold text-medtronic-deepPurple">MiniMed™ 780G</p>
                  <p className="text-medtronic-purple mt-2">Advanced Hybrid Closed Loop System</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="products" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-medtronic-deepPurple mb-4">
              Comprehensive Diabetes Management
            </h2>
            <p className="text-xl text-medtronic-purple max-w-3xl mx-auto">
              Experience the most advanced insulin pump system with features designed for your lifestyle
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-medtronic-lightCyan to-medtronic-skyBlue rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <feature.icon className="h-10 w-10 text-medtronic-deepPurple" />
                </div>
                <h3 className="text-lg font-semibold text-medtronic-deepPurple mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="healthcare" className="py-20 bg-gradient-medtronic scroll-mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their diabetes management with MiniMed™
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-white text-medtronic-deepPurple hover:bg-gray-100 text-lg px-10 py-6 rounded-full font-semibold"
          >
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="support" className="bg-medtronic-deepPurple text-gray-300 py-12 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-2">
                <li><a href="#products" className="hover:text-white transition-colors">MiniMed 780G</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Guardian Sensors</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">CareLink Software</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#healthcare" className="hover:text-white transition-colors">Customer Service</a></li>
                <li><a href="#healthcare" className="hover:text-white transition-colors">Training</a></li>
                <li><a href="#healthcare" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#home" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#home" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#legal" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#legal" className="hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="#legal" className="hover:text-white transition-colors">Regulatory</a></li>
              </ul>
            </div>
          </div>
          <div id="legal" className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">
              © 2024 MiniMed Dashboard. This is a demonstration platform inspired by Medtronic systems.
            </p>
            <p className="text-sm mt-2">
              Not affiliated with or endorsed by Medtronic, Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
