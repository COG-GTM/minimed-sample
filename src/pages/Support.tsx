import { useLanguage } from '@/contexts/LanguageContext';
import PublicHeader from '@/components/PublicHeader';
import { Phone, BookOpen, LifeBuoy } from 'lucide-react';

const Support = () => {
  const { tSync } = useLanguage();

  const resources = [
    {
      icon: Phone,
      name: 'Customer Service',
      description: '24/7 technical support for your MiniMed™ system'
    },
    {
      icon: BookOpen,
      name: 'Training',
      description: 'Guides and videos to help you get the most from your device'
    },
    {
      icon: LifeBuoy,
      name: 'Resources',
      description: 'User manuals, FAQs, and troubleshooting information'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <section className="py-20 bg-gradient-minimed">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-medtronic-deepPurple mb-4">
            {tSync('nav.support')}
          </h1>
          <p className="text-xl text-medtronic-purple max-w-3xl mx-auto">
            We're here to help you every step of the way
          </p>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="text-center group p-8 rounded-2xl border hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-medtronic-lightCyan to-medtronic-skyBlue rounded-full flex items-center justify-center mb-4 shadow-md">
                  <resource.icon className="h-10 w-10 text-medtronic-deepPurple" />
                </div>
                <h3 className="text-lg font-semibold text-medtronic-deepPurple mb-2">
                  {resource.name}
                </h3>
                <p className="text-gray-600">
                  {resource.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;
