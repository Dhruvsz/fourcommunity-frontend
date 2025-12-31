
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, User, Fingerprint } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface AdminAuthProps {
  onAuthenticate: () => void;
}

const AdminAuth = ({ onAuthenticate }: AdminAuthProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const { toast } = useToast();

  // Secure admin credentials (in production, these would be environment variables)
  const ADMIN_CREDENTIALS = {
    username: "dhruv_admin",
    password: "GroupFinder2024!@#"
  };

  // Check for biometric authentication support
  useEffect(() => {
    const checkBiometricSupport = async () => {
      if (window.PublicKeyCredential &&
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
        setBiometricAvailable(true);
        console.log('✅ Biometric authentication available');
      } else {
        console.log('❌ Biometric authentication not available');
      }
    };

    checkBiometricSupport();
  }, []);

  // Biometric authentication handler
  const handleBiometricAuth = async () => {
    setBiometricLoading(true);

    try {
      // Check if user has registered biometric auth before
      const savedBiometric = localStorage.getItem('adminBiometricRegistered');

      if (!savedBiometric) {
        // First time - register biometric
        await registerBiometric();
      } else {
        // Authenticate with biometric
        await authenticateWithBiometric();
      }
    } catch (error) {
      console.error('❌ Biometric authentication error:', error);
      toast({
        title: "Biometric Authentication Failed",
        description: "Please use username and password instead.",
        variant: "destructive",
      });
    } finally {
      setBiometricLoading(false);
    }
  };

  // Register biometric authentication
  const registerBiometric = async () => {
    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "GroupFinder Admin",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode("dhruv_admin"),
            name: "dhruv_admin",
            displayName: "Dhruv - Admin",
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
          attestation: "direct"
        }
      });

      if (credential) {
        // Save biometric registration
        localStorage.setItem('adminBiometricRegistered', 'true');
        localStorage.setItem('adminBiometricId', credential.id);

        // Authenticate user
        authenticateUser();

        toast({
          title: "🎉 Biometric Setup Complete!",
          description: "Your fingerprint/Face ID has been registered for admin access.",
        });
      }
    } catch (error) {
      throw new Error('Biometric registration failed');
    }
  };

  // Authenticate with biometric
  const authenticateWithBiometric = async () => {
    try {
      const credentialId = localStorage.getItem('adminBiometricId');

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [{
            id: Uint8Array.from(atob(credentialId), c => c.charCodeAt(0)),
            type: 'public-key'
          }],
          userVerification: "required",
          timeout: 60000
        }
      });

      if (assertion) {
        authenticateUser();
        toast({
          title: "🔐 Biometric Authentication Successful",
          description: "Welcome back! Authenticated with your biometric data.",
        });
      }
    } catch (error) {
      throw new Error('Biometric authentication failed');
    }
  };

  // Common authentication success handler
  const authenticateUser = () => {
    const authData = {
      authenticated: true,
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      user: "dhruv_admin",
      method: "biometric"
    };
    localStorage.setItem("adminAuth", JSON.stringify(authData));
    localStorage.setItem("adminAuthenticated", "true");
    onAuthenticate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Rate limiting - block after 3 failed attempts
    if (attempts >= 3) {
      toast({
        title: "Access Blocked",
        description: "Too many failed attempts. Please refresh the page and try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate server authentication delay
    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Set authentication with expiry (24 hours)
        const authData = {
          authenticated: true,
          timestamp: Date.now(),
          expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          user: username,
          method: "password"
        };
        localStorage.setItem("adminAuth", JSON.stringify(authData));
        localStorage.setItem("adminAuthenticated", "true"); // Backward compatibility

        onAuthenticate();
        toast({
          title: "🎉 Authentication Successful",
          description: `Welcome back, ${username}!`,
        });
      } else {
        setAttempts(prev => prev + 1);
        toast({
          title: "❌ Authentication Failed",
          description: `Invalid credentials. ${3 - attempts - 1} attempts remaining.`,
          variant: "destructive",
        });

        // Clear form on failed attempt
        setPassword("");
        if (attempts >= 2) {
          setUsername("");
        }
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
          <CardHeader className="text-center pb-8">
            {/* Animated Logo */}
            <motion.div
              className="mx-auto w-20 h-20 relative mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl blur-sm opacity-75 animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Shield className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
            </motion.div>

            {/* Animated Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <CardTitle className="text-4xl text-white font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
                GroupFinder Admin
              </CardTitle>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <CardDescription className="text-gray-300 font-medium">
                  Secure Management Portal
                </CardDescription>
              </div>
            </motion.div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {/* Username Field */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Label htmlFor="username" className="text-gray-200 font-semibold text-sm tracking-wide">
                  Admin Username
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your admin username"
                    className="bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 placeholder:text-gray-500"
                    required
                    disabled={attempts >= 3}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Label htmlFor="password" className="text-gray-200 font-semibold text-sm tracking-wide">
                  Admin Password
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your admin password"
                    className="bg-white/5 border border-white/10 text-white pl-4 pr-12 py-3 rounded-xl focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 placeholder:text-gray-500"
                    required
                    disabled={attempts >= 3}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={attempts >= 3}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </motion.div>

              {/* Login Buttons */}
              <motion.div
                className="space-y-4 pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {/* Primary Login Button */}
                <Button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading || !username || !password || attempts >= 3}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : attempts >= 3 ? (
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      <span>Access Blocked</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      <span>Access Admin Panel</span>
                    </div>
                  )}
                </Button>

                {/* Biometric Divider */}
                {biometricAvailable && (
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-black/40 px-4 text-gray-400 font-medium tracking-wider">Or continue with</span>
                    </div>
                  </div>
                )}

                {/* Biometric Button */}
                {biometricAvailable && (
                  <Button
                    type="button"
                    onClick={handleBiometricAuth}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={biometricLoading || attempts >= 3}
                  >
                    {biometricLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Fingerprint className="h-5 w-5" />
                        <span>
                          {localStorage.getItem('adminBiometricRegistered') ?
                            "Use Biometric Authentication" :
                            "Setup Biometric Authentication"
                          }
                        </span>
                      </div>
                    )}
                  </Button>
                )}
              </motion.div>
            </motion.form>

            {/* Error Messages */}
            {attempts > 0 && attempts < 3 && (
              <motion.div
                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-300 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">
                    {attempts} failed attempt{attempts > 1 ? 's' : ''}. {3 - attempts} remaining.
                  </span>
                </div>
              </motion.div>
            )}

            {attempts >= 3 && (
              <motion.div
                className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-sm text-red-200 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-400" />
                  <span className="font-medium">
                    Access blocked due to multiple failed attempts. Refresh the page to try again.
                  </span>
                </div>
              </motion.div>
            )}

            {/* Security Features */}
            <motion.div
              className="mt-8 p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm font-semibold text-gray-200 tracking-wide">Security Features</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>24-hour session expiry</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Rate limiting protection</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Secure credential validation</span>
                </div>
                {biometricAvailable && (
                  <div className="flex items-center gap-2 text-xs text-emerald-300">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span>Biometric authentication available</span>
                  </div>
                )}
                {localStorage.getItem('adminBiometricRegistered') && (
                  <div className="flex items-center gap-2 text-xs text-emerald-300">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                    <span>Your biometric data is registered</span>
                  </div>
                )}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
      <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
      <div className="absolute bottom-10 right-10 w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-1000"></div>
    </div>
  );
};

export default AdminAuth;
