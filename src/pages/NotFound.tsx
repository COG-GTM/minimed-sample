import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-minimed flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-medtronic-deepPurple mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-medtronic-purple mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-medtronic-brightBlue hover:bg-blue-600 text-white px-8 rounded-full"
          >
            Go Home
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-2 border-medtronic-deepPurple text-medtronic-deepPurple hover:bg-medtronic-deepPurple hover:text-white px-8 rounded-full"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
