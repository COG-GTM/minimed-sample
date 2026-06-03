import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageDropdown from '@/components/LanguageDropdown';
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [translations, setTranslations] = useState({
    backToHome: 'Back to Home',
    welcomeToMiniMed: 'Welcome to MiniMed',
    signInDescription: 'Sign in to access your diabetes management dashboard',
    email: 'Email',
    enterEmail: 'Enter your email',
    password: 'Password',
    enterPassword: 'Enter your password',
    rememberMe: 'Remember me',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    orContinueWith: 'Or continue with',
    demoPatientAccount: 'Demo Patient Account',
    demoHealthcareProvider: 'Demo Healthcare Provider',
    forgotPassword: 'Forgot your password?',
    dontHaveAccount: "Don't have an account?",
    createAccount: 'Create account',
    demoCredentials: 'Demo Credentials',
    patient: 'Patient',
    healthcareProvider: 'Healthcare Provider'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      const newTranslations = {
        backToHome: await t('Back to Home'),
        welcomeToMiniMed: await t('Welcome to MiniMed'),
        signInDescription: await t('Sign in to access your diabetes management dashboard'),
        email: await t('Email'),
        enterEmail: await t('Enter your email'),
        password: await t('Password'),
        enterPassword: await t('Enter your password'),
        rememberMe: await t('Remember me'),
        signIn: await t('Sign In'),
        signingIn: await t('Signing in...'),
        orContinueWith: await t('Or continue with'),
        demoPatientAccount: await t('Demo Patient Account'),
        demoHealthcareProvider: await t('Demo Healthcare Provider'),
        forgotPassword: await t('Forgot your password?'),
        dontHaveAccount: await t("Don't have an account?"),
        createAccount: await t('Create account'),
        demoCredentials: await t('Demo Credentials'),
        patient: await t('Patient'),
        healthcareProvider: await t('Healthcare Provider')
      };
      setTranslations(newTranslations);
    };
    loadTranslations();
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = await t('Invalid email or password. Try patient@example.com / demo123');
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'patient' | 'doctor') => {
    setError('');
    setIsLoading(true);
    
    const credentials = role === 'patient' 
      ? { email: 'patient@example.com', password: 'demo123', rememberMe: true }
      : { email: 'doctor@example.com', password: 'demo123', rememberMe: true };

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = await t('Login failed. Please try again.');
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-minimed flex flex-col">
      {/* Skip Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-white focus:text-medtronic-deepPurple focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-medtronic-brightBlue"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="p-4" role="banner">
        <nav className="container mx-auto flex justify-between items-center" aria-label="Page navigation">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-medtronic-deepPurple hover:text-medtronic-purple transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-medtronic-brightBlue focus:rounded"
            aria-label="Back to home page"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{translations.backToHome}</span>
          </Link>
          <LanguageDropdown />
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-sm border-0">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-medtronic-brightBlue to-medtronic-skyBlue rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
            </div>
            <CardTitle className="text-3xl text-center font-light text-medtronic-deepPurple">{translations.welcomeToMiniMed}</CardTitle>
            <CardDescription className="text-center text-medtronic-purple">
              {translations.signInDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{translations.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={translations.enterEmail}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{translations.password}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={translations.enterPassword}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-300 text-medical-blue focus:ring-medical-blue"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  {translations.rememberMe}
                </Label>
              </div>

              <Button 
                type="submit" 
                variant="medical" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? translations.signingIn : translations.signIn}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{translations.orContinueWith}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleDemoLogin('patient')}
                disabled={isLoading}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 bg-medical-green rounded-full"></div>
                  <span>{translations.demoPatientAccount}</span>
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleDemoLogin('doctor')}
                disabled={isLoading}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 bg-medical-blue rounded-full"></div>
                  <span>{translations.demoHealthcareProvider}</span>
                </div>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-gray-600">
              <a href="#" className="hover:text-medical-blue transition-colors">
                {translations.forgotPassword}
              </a>
            </div>
            <div className="text-center text-sm text-gray-600">
              {translations.dontHaveAccount}{' '}
              <a href="#" className="text-medical-blue hover:underline">
                {translations.createAccount}
              </a>
            </div>
          </CardFooter>
        </Card>
      </main>

      {/* Demo Credentials Info */}
      <div className="p-4">
        <div className="container mx-auto max-w-md">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-900 mb-2">{translations.demoCredentials}</h3>
              <div className="space-y-1 text-sm text-blue-700">
                <p><strong>{translations.patient}:</strong> patient@example.com / demo123</p>
                <p><strong>{translations.healthcareProvider}:</strong> doctor@example.com / demo123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
