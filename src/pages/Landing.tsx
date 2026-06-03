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
  X,
  ChevronDown,
  Users,
  Clock,
  TrendingUp,
  Star,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const { tSync } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Activity,
      title: tSync('features.monitoring'),
      description: tSync('landing.feature.monitoring.desc')
    },
    {
      icon: Shield,
      title: tSync('features.delivery'),
      description: tSync('landing.feature.delivery.desc')
    },
    {
      icon: Share2,
      title: tSync('features.sharing'),
      description: tSync('landing.feature.sharing.desc')
    },
    {
      icon: Smartphone,
      title: tSync('features.mobile'),
      description: tSync('landing.feature.mobile.desc')
    }
  ];

  const stats = [
    { value: '95%', label: tSync('landing.stats.timeInRange'), icon: TrendingUp },
    { value: '50K+', label: tSync('landing.stats.activeUsers'), icon: Users },
    { value: '24/7', label: tSync('landing.stats.monitoring'), icon: Clock },
    { value: '4.8', label: tSync('landing.stats.rating'), icon: Star }
  ];

  const steps = [
    {
      step: '01',
      title: tSync('landing.howItWorks.step1.title'),
      description: tSync('landing.howItWorks.step1.desc')
    },
    {
      step: '02',
      title: tSync('landing.howItWorks.step2.title'),
      description: tSync('landing.howItWorks.step2.desc')
    },
    {
      step: '03',
      title: tSync('landing.howItWorks.step3.title'),
      description: tSync('landing.howItWorks.step3.desc')
    }
  ];

  const testimonials = [
    {
      name: tSync('landing.testimonial1.name'),
      role: tSync('landing.testimonial1.role'),
      quote: tSync('landing.testimonial1.quote'),
      rating: 5
    },
    {
      name: tSync('landing.testimonial2.name'),
      role: tSync('landing.testimonial2.role'),
      quote: tSync('landing.testimonial2.quote'),
      rating: 5
    },
    {
      name: tSync('landing.testimonial3.name'),
      role: tSync('landing.testimonial3.role'),
      quote: tSync('landing.testimonial3.quote'),
      rating: 5
    }
  ];

  const faqs = [
    {
      question: tSync('landing.faq1.question'),
      answer: tSync('landing.faq1.answer')
    },
    {
      question: tSync('landing.faq2.question'),
      answer: tSync('landing.faq2.answer')
    },
    {
      question: tSync('landing.faq3.question'),
      answer: tSync('landing.faq3.answer')
    },
    {
      question: tSync('landing.faq4.question'),
      answer: tSync('landing.faq4.answer')
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
              <a href="#features" className="text-white/90 hover:text-white transition-colors font-medium">
                {tSync('nav.products')}
              </a>
              <a href="#how-it-works" className="text-white/90 hover:text-white transition-colors font-medium">
                {tSync('nav.support')}
              </a>
              <a href="#testimonials" className="text-white/90 hover:text-white transition-colors font-medium">
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
              <a href="#features" className="block py-2 text-gray-600">
                {tSync('nav.products')}
              </a>
              <a href="#how-it-works" className="block py-2 text-gray-600">
                {tSync('nav.support')}
              </a>
              <a href="#testimonials" className="block py-2 text-gray-600">
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
      <section className="relative overflow-hidden bg-gradient-minimed">
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
                  onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-lg px-8 py-6 rounded-full border-2 border-medtronic-deepPurple text-medtronic-deepPurple hover:bg-medtronic-deepPurple hover:text-white"
                >
                  {tSync('landing.learnMore')}
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

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-14 h-14 mx-auto mb-3 bg-medtronic-lightCyan rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className="h-7 w-7 text-medtronic-brightBlue" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-medtronic-deepPurple mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-medtronic-purple font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-medtronic-deepPurple mb-4">
              {tSync('landing.features.title')}
            </h2>
            <p className="text-xl text-medtronic-purple max-w-3xl mx-auto">
              {tSync('landing.features.subtitle')}
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-medtronic-deepPurple mb-4">
              {tSync('landing.howItWorks.title')}
            </h2>
            <p className="text-xl text-medtronic-purple max-w-2xl mx-auto">
              {tSync('landing.howItWorks.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-medtronic-deepPurple to-medtronic-brightBlue rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">{step.step}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-medtronic-brightBlue/30 to-transparent" />
                )}
                <h3 className="text-xl font-semibold text-medtronic-deepPurple mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-minimed">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-medtronic-deepPurple mb-4">
              {tSync('landing.testimonials.title')}
            </h2>
            <p className="text-xl text-medtronic-purple max-w-2xl mx-auto">
              {tSync('landing.testimonials.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-medtronic-coral fill-medtronic-coral" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-medtronic-brightBlue to-medtronic-skyBlue rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-medtronic-deepPurple">{testimonial.name}</p>
                    <p className="text-sm text-medtronic-purple">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-medtronic-deepPurple mb-4">
              {tSync('landing.faq.title')}
            </h2>
            <p className="text-xl text-medtronic-purple max-w-2xl mx-auto">
              {tSync('landing.faq.subtitle')}
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden hover:border-medtronic-brightBlue/30 transition-colors"
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-medtronic-deepPurple pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-medtronic-brightBlue flex-shrink-0 transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-medtronic">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            {tSync('landing.cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {tSync('landing.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-white text-medtronic-deepPurple hover:bg-gray-100 text-lg px-10 py-6 rounded-full font-semibold"
            >
              {tSync('landing.cta.button')}
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center space-x-2 text-white/80">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm">{tSync('landing.cta.benefit1')}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm">{tSync('landing.cta.benefit2')}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm">{tSync('landing.cta.benefit3')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-medtronic-deepPurple text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">{tSync('nav.products')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">MiniMed 780G</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guardian Sensors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CareLink Software</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{tSync('nav.support')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Regulatory</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
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
