import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const ConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<{
    supabase: 'checking' | 'connected' | 'error';
    auth: 'checking' | 'connected' | 'error';
    database: 'checking' | 'connected' | 'error';
    environment: string;
    url: string;
  }>({
    supabase: 'checking',
    auth: 'checking', 
    database: 'checking',
    environment: import.meta.env.MODE || 'unknown',
    url: window.location.origin
  });

  const testConnections = async () => {
    setStatus(prev => ({ ...prev, supabase: 'checking', auth: 'checking', database: 'checking' }));
    
    // Test Supabase connection
    try {
      const { data, error } = await supabase.auth.getSession();
      setStatus(prev => ({ ...prev, supabase: error ? 'error' : 'connected' }));
    } catch (error) {
      setStatus(prev => ({ ...prev, supabase: 'error' }));
    }
    
    // Test auth service
    try {
      const { data, error } = await supabase.auth.getUser();
      setStatus(prev => ({ ...prev, auth: error && error.message !== 'Auth session missing!' ? 'error' : 'connected' }));
    } catch (error) {
      setStatus(prev => ({ ...prev, auth: 'error' }));
    }
    
    // Test database connection
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      setStatus(prev => ({ ...prev, database: error ? 'error' : 'connected' }));
    } catch (error) {
      setStatus(prev => ({ ...prev, database: 'error' }));
    }
  };

  useEffect(() => {
    testConnections();
  }, []);

  const getStatusIcon = (status: 'checking' | 'connected' | 'error') => {
    switch (status) {
      case 'checking': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: 'checking' | 'connected' | 'error') => {
    switch (status) {
      case 'checking': return <Badge variant="secondary">Checking...</Badge>;
      case 'connected': return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {getStatusIcon(status.supabase)}
              Supabase Client
            </span>
            {getStatusBadge(status.supabase)}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {getStatusIcon(status.auth)}
              Authentication
            </span>
            {getStatusBadge(status.auth)}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {getStatusIcon(status.database)}
              Database
            </span>
            {getStatusBadge(status.database)}
          </div>
        </div>
        
        <div className="pt-2 border-t text-sm text-gray-600">
          <p><strong>Environment:</strong> {status.environment}</p>
          <p><strong>URL:</strong> {status.url}</p>
        </div>
        
        <Button onClick={testConnections} className="w-full" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retest Connections
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConnectionTest;