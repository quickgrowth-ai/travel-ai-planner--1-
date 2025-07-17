import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DomainDebugger } from '@/components/DomainDebugger';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false);
  const { login, signup } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Auth attempt:', { 
        isLogin, 
        email, 
        environment: import.meta.env.MODE,
        domain: window.location.hostname,
        origin: window.location.origin
      });
      
      if (isLogin) {
        await login({ email, password });
        toast({
          title: 'Login successful!',
          description: 'Welcome back!'
        });
      } else {
        await signup({ email, password, name });
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.'
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = 'Authentication failed';
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please try logging in.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Database error')) {
          errorMessage = `Database connection error. Domain: ${window.location.hostname}`;
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowDebugger(!showDebugger)}
        >
          Debug
        </Button>
        <LanguageSelector />
      </div>
      
      {showDebugger && (
        <div className="absolute top-20 right-4 z-50">
          <DomainDebugger />
        </div>
      )}
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68619901175d7c6ee1f37cfd_1752719278671_18257536.png" 
              alt="UniTravel Logo" 
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t('welcome')}
          </CardTitle>
          <CardDescription>
            {isLogin ? t('signIn') : t('signUp')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={`Enter your ${t('email').toLowerCase()}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={`Enter your ${t('password').toLowerCase()}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? t('login') : t('register')}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isLogin ? `Don't have an account? ${t('signUp')}` : `Already have an account? ${t('signIn')}`}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;