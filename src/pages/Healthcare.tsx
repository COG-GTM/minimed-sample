import { useLanguage } from '@/contexts/LanguageContext';
import PublicHeader from '@/components/PublicHeader';
import { Stethoscope, Share2, FileText } from 'lucide-react';

const Healthcare = () => {
  const { tSync } = useLanguage();

  const offerings = [
    {
      icon: Stethoscope,
      name: 'Clinical Evidence',
      description: 'Research and outcomes data supporting MiniMed™ therapy'
    },
    {
      icon: Share2,
      name: 'Patient Data Sharing',
      description: 'Review real-time patient data through CareLink™ connectivity'
    },
    {
      icon: FileText,
      name: 'Professional Resources',
      description: 'Prescribing information and clinical practice tools'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <section className="py-20 bg-gradient-minimed">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-medtronic-deepPurple mb-4">
            {tSync('nav.healthcare')}
          </h1>
          <p className="text-xl text-medtronic-purple max-w-3xl mx-auto">
            Tools and evidence for healthcare professionals
          </p>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {offerings.map((offering, index) => (
              <div key={index} className="text-center group p-8 rounded-2xl border hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-medtronic-lightCyan to-medtronic-skyBlue rounded-full flex items-center justify-center mb-4 shadow-md">
                  <offering.icon className="h-10 w-10 text-medtronic-deepPurple" />
                </div>
                <h3 className="text-lg font-semibold text-medtronic-deepPurple mb-2">
                  {offering.name}
                </h3>
                <p className="text-gray-600">
                  {offering.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Healthcare;
