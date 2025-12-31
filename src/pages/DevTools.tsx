import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DevTools = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem('devtools_auth') === 'true'
  );

  const handleAuth = () => {
    // Simple password check - in production, use proper auth
    if (password === 'dev2024') {
      sessionStorage.setItem('devtools_auth', 'true');
      setAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="p-8 bg-gray-800 border-gray-700 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-6">Developer Tools</h1>
          <p className="text-gray-300 mb-4">Enter password to access dev tools</p>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            placeholder="Password"
            className="mb-4"
          />
          <Button onClick={handleAuth} className="w-full">
            Access Dev Tools
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-6">🛠️ Developer Tools</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/email-test" 
              className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-center transition"
            >
              <div className="text-lg font-semibold mb-2">📧 Email Test</div>
              <div className="text-sm opacity-90">Test email notifications</div>
            </a>
            
            <a 
              href="/form-test" 
              className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition"
            >
              <div className="text-lg font-semibold mb-2">Form Test</div>
              <div className="text-sm opacity-90">Test form submission reliability</div>
            </a>
            
            <a 
              href="/auto-load-test" 
              className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center transition"
            >
              <div className="text-lg font-semibold mb-2">Auto Load Test</div>
              <div className="text-sm opacity-90">Test infinite scroll</div>
            </a>
            
            <a 
              href="/bulletproof-test" 
              className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center transition"
            >
              <div className="text-lg font-semibold mb-2">Bulletproof Test</div>
              <div className="text-sm opacity-90">Test approval system</div>
            </a>
            
            <a 
              href="/test-database" 
              className="p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-center transition"
            >
              <div className="text-lg font-semibold mb-2">Database Test</div>
              <div className="text-sm opacity-90">Test database connection</div>
            </a>
          </div>

          <div className="mt-6">
            <Button 
              onClick={() => {
                sessionStorage.removeItem('devtools_auth');
                setAuthenticated(false);
              }}
              variant="outline"
              className="w-full"
            >
              Lock Dev Tools
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DevTools;
