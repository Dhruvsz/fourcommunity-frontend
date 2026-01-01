import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface AdminPasswordPromptProps {
  onPasswordVerified: () => void;
  userEmail: string;
}

const AdminPasswordPrompt: React.FC<AdminPasswordPromptProps> = ({ 
  onPasswordVerified, 
  userEmail 
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error('Please enter the admin password');
      return;
    }

    setIsVerifying(true);

    // Validate against environment variable
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('❌ VITE_ADMIN_PASSWORD not configured');
      toast.error('Admin password not configured. Contact administrator.');
      setIsVerifying(false);
      return;
    }

    const isPasswordValid = password === adminPassword;

    if (isPasswordValid) {
      // Store verification in sessionStorage
      sessionStorage.setItem("admin_verified", "true");
      toast.success('Admin access granted');
      onPasswordVerified();
    } else {
      toast.error('Incorrect admin password');
      setPassword(''); // Clear password on failure
    }

    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-white">Admin Password Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              Enter the admin password to access the dashboard.
            </p>
            
            <div className="bg-gray-800 p-3 rounded-lg text-xs text-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-3 w-3" />
                <span className="font-medium">Authorized User:</span>
              </div>
              <div className="ml-5">
                <div>{userEmail}</div>
                <div className="text-green-500">Email verified ✓</div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-gray-300">
                Admin Password
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-gray-800 border-gray-700 text-white pr-10"
                  disabled={isVerifying}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  disabled={isVerifying}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                type="submit"
                className="w-full"
                disabled={isVerifying || !password.trim()}
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Verify Password
                  </>
                )}
              </Button>
              
              <Button 
                type="button"
                onClick={() => window.location.href = '/'} 
                className="w-full"
                variant="outline"
                disabled={isVerifying}
              >
                Cancel
              </Button>
            </div>
          </form>
          
          <p className="text-xs text-gray-500 text-center">
            This password is known only to authorized administrators.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPasswordPrompt;