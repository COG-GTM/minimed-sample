import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import PublicHeader from '@/components/PublicHeader';
import { 
  Activity, 
  Shield, 
  Smartphone, 
  Share2
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { tSync } = useLanguage();

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
      <PublicHeader />

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
      <section className="py-20 bg-gray-50">
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
      <section className="py-20 bg-gradient-medtronic">
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
      <footer className="bg-medtronic-deepPurple text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">MiniMed 780G</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guardian Sensors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CareLink Software</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
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
