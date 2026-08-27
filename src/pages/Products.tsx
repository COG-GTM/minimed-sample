import { useLanguage } from '@/contexts/LanguageContext';
import PublicHeader from '@/components/PublicHeader';
import { Activity, Droplet, Smartphone } from 'lucide-react';

const Products = () => {
  const { tSync } = useLanguage();

  const products = [
    {
      icon: Activity,
      name: 'MiniMed™ 780G System',
      description: 'Advanced hybrid closed loop insulin pump system with SmartGuard™ technology'
    },
    {
      icon: Droplet,
      name: 'Guardian™ 4 Sensor',
      description: 'Continuous glucose monitoring sensor with no fingersticks required'
    },
    {
      icon: Smartphone,
      name: 'CareLink™ Software',
      description: 'Diabetes management software for reviewing therapy data and trends'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <section className="py-20 bg-gradient-minimed">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-medtronic-deepPurple mb-4">
            {tSync('nav.products')}
          </h1>
          <p className="text-xl text-medtronic-purple max-w-3xl mx-auto">
            Explore our family of diabetes management products
          </p>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div key={index} className="text-center group p-8 rounded-2xl border hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-medtronic-lightCyan to-medtronic-skyBlue rounded-full flex items-center justify-center mb-4 shadow-md">
                  <product.icon className="h-10 w-10 text-medtronic-deepPurple" />
                </div>
                <h3 className="text-lg font-semibold text-medtronic-deepPurple mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600">
                  {product.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
