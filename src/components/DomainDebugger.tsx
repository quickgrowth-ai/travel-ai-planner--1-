import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { AuthAPI } from '@/lib/auth';

interface DebugInfo {
  domain: string;
  origin: string;
  supabaseUrl: string;
  supabaseKey: string;
  envMode: string;
  envVars: {
    supabaseUrl: string;
    supabaseKey: string;
  };
}

export const DomainDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    const info: DebugInfo = {
      domain: window.location.hostname,
      origin: window.location.origin,
      supabaseUrl: 'https://txzecrhhoefpsbqrzjwm.supabase.co',
      supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      envMode: import.meta.env?.MODE || 'Unknown',
      envVars: {
        supabaseUrl: import.meta.env?.VITE_SUPABASE_URL || 'Not set',
        supabaseKey: import.meta.env?.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      }
    };
    setDebugInfo(info);
    
    testConnection();
  }, []);

  const testConnection = async () => {
    const results: string[] = [];
    
    try {
      // Test Supabase connection
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        results.push(`❌ Supabase connection failed: ${error.message}`);
      } else {
        results.push('✅ Supabase connection successful');
      }
    } catch (error) {
      results.push(`❌ Supabase connection error: ${error}`);
    }

    try {
      // Test auth endpoint
      const testResult = await AuthAPI.getSession();
      if (testResult.error) {
        results.push(`❌ Auth API failed: ${testResult.error.message}`);
      } else {
        results.push('✅ Auth API working');
      }
    } catch (error) {
      results.push(`❌ Auth API error: ${error}`);
    }

    // Test database access
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) {
        results.push(`❌ Database access failed: ${error.message}`);
      } else {
        results.push('✅ Database access working');
      }
    } catch (error) {
      results.push(`❌ Database access error: ${error}`);
    }

    setTestResults(results);
  };

  const testSignup = async () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    try {
      const result = await AuthAPI.signup({
        email: testEmail,
        password: testPassword,
        name: 'Test User'
      });
      
      if (result.error) {
        setTestResults(prev => [...prev, `❌ Test signup failed: ${result.error.message}`]);
      } else {
        setTestResults(prev => [...prev, '✅ Test signup successful']);
      }
    } catch (error) {
      setTestResults(prev => [...prev, `❌ Test signup error: ${error}`]);
    }
  };

  if (!debugInfo) return <div>Loading debug info...</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Domain Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Domain:</strong> {debugInfo.domain}</div>
          <div><strong>Origin:</strong> {debugInfo.origin}</div>
          <div><strong>Environment:</strong> {debugInfo.envMode}</div>
          <div><strong>Supabase URL:</strong> {debugInfo.envVars.supabaseUrl}</div>
          <div><strong>Supabase Key:</strong> {debugInfo.envVars.supabaseKey}</div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">Test Results:</h3>
          {testResults.map((result, index) => (
            <div key={index} className="text-sm font-mono">{result}</div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button onClick={testConnection} variant="outline" size="sm">
            Retest Connection
          </Button>
          <Button onClick={testSignup} variant="outline" size="sm">
            Test Signup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};