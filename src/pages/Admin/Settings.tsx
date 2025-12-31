
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  AlertTriangle,
  Save,
  Shield,
  Bell,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: "Dhruv Choudhary",
    email: "dhruv@example.com",
    phone: "+91 9876543210",
    role: "Platform Admin",
    avatar: "/placeholder.svg"
  });
  
  const [platformSettings, setPlatformSettings] = useState({
    whatsappLimit: 1024,
    slackLimit: 100000,
    telegramLimit: 200000,
    autoApprove: false,
    notifyOnNewSubmission: true,
    notifyOnCapacity: true,
    enableEmailAlerts: true,
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };
  
  const handlePlatformSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Platform settings updated",
      description: "The changes have been saved successfully",
    });
  };
  
  return (
    <div>
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your profile and platform settings</p>
        </motion.div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-1 lg:col-span-4">
          <Card className="shadow-sm border border-gray-800 bg-gray-900/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-white">Admin Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-6">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="bg-gray-700 text-white">{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
              <p className="text-gray-400">{profile.role}</p>
              
              <Button variant="outline" className="mt-4 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                Change Avatar
              </Button>
              
              <div className="w-full mt-6 pt-6 border-t border-gray-700">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-300">{profile.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-300">{profile.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 lg:col-span-8 space-y-6">
          <Card className="shadow-sm border border-gray-800 bg-gray-900/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center text-white">
                <User className="h-5 w-5 mr-2 text-blue-500" /> Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profile.name} 
                      onChange={e => setProfile({...profile, name: e.target.value})}
                      className="bg-gray-800/70 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profile.email} 
                      onChange={e => setProfile({...profile, email: e.target.value})}
                      className="bg-gray-800/70 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={profile.phone} 
                      onChange={e => setProfile({...profile, phone: e.target.value})}
                      className="bg-gray-800/70 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-300">Role</Label>
                    <Input 
                      id="role" 
                      value={profile.role} 
                      disabled 
                      className="bg-gray-800/50 border-gray-700 text-gray-400"
                    />
                  </div>
                </div>
                
                <Separator className="my-6 bg-gray-700" />
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium flex items-center text-white">
                    <Lock className="h-5 w-5 mr-2 text-gray-400" /> Password Management
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
                      <Input id="currentPassword" type="password" placeholder="••••••••" className="bg-gray-800/70 border-gray-700 text-white" />
                    </div>
                    <div></div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                      <Input id="newPassword" type="password" placeholder="••••••••" className="bg-gray-800/70 border-gray-700 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="••••••••" className="bg-gray-800/70 border-gray-700 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border border-gray-800 bg-gray-900/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center text-white">
                <Shield className="h-5 w-5 mr-2 text-green-500" /> Platform Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handlePlatformSettingsUpdate}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-4 text-white">Platform Capacity Limits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="whatsappLimit" className="text-gray-300">WhatsApp Limit</Label>
                        <Input 
                          id="whatsappLimit" 
                          type="number" 
                          value={platformSettings.whatsappLimit} 
                          onChange={e => setPlatformSettings({...platformSettings, whatsappLimit: parseInt(e.target.value)})}
                          className="bg-gray-800/70 border-gray-700 text-white"
                        />
                        <p className="text-xs text-gray-400">Default: 1024 members</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slackLimit" className="text-gray-300">Slack Limit</Label>
                        <Input 
                          id="slackLimit" 
                          type="number" 
                          value={platformSettings.slackLimit} 
                          onChange={e => setPlatformSettings({...platformSettings, slackLimit: parseInt(e.target.value)})}
                          className="bg-gray-800/70 border-gray-700 text-white"
                        />
                        <p className="text-xs text-gray-400">Default: 100,000 members</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telegramLimit" className="text-gray-300">Telegram Limit</Label>
                        <Input 
                          id="telegramLimit" 
                          type="number" 
                          value={platformSettings.telegramLimit} 
                          onChange={e => setPlatformSettings({...platformSettings, telegramLimit: parseInt(e.target.value)})}
                          className="bg-gray-800/70 border-gray-700 text-white"
                        />
                        <p className="text-xs text-gray-400">Default: 200,000 members</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-700" />
                  
                  <div>
                    <h3 className="text-base font-medium flex items-center mb-4 text-white">
                      <Bell className="h-5 w-5 mr-2 text-amber-500" /> Notification Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="autoApprove" className="font-medium text-white">Auto-approve Submissions</Label>
                          <p className="text-sm text-gray-400">Automatically approve new community submissions</p>
                        </div>
                        <Switch 
                          id="autoApprove"
                          checked={platformSettings.autoApprove}
                          onCheckedChange={(checked) => 
                            setPlatformSettings({...platformSettings, autoApprove: checked})
                          }
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="notifyNewSubmission" className="font-medium text-white">New Submission Alerts</Label>
                          <p className="text-sm text-gray-400">Receive notifications for new community submissions</p>
                        </div>
                        <Switch 
                          id="notifyNewSubmission"
                          checked={platformSettings.notifyOnNewSubmission}
                          onCheckedChange={(checked) => 
                            setPlatformSettings({...platformSettings, notifyOnNewSubmission: checked})
                          }
                          className="data-[state=checked]:bg-blue-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="notifyCapacity" className="font-medium text-white">Capacity Alerts</Label>
                          <p className="text-sm text-gray-400">Receive alerts when communities reach capacity limits</p>
                        </div>
                        <Switch 
                          id="notifyCapacity"
                          checked={platformSettings.notifyOnCapacity}
                          onCheckedChange={(checked) => 
                            setPlatformSettings({...platformSettings, notifyOnCapacity: checked})
                          }
                          className="data-[state=checked]:bg-amber-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enableEmailAlerts" className="font-medium text-white">Email Notifications</Label>
                          <p className="text-sm text-gray-400">Receive important platform alerts via email</p>
                        </div>
                        <Switch 
                          id="enableEmailAlerts"
                          checked={platformSettings.enableEmailAlerts}
                          onCheckedChange={(checked) => 
                            setPlatformSettings({...platformSettings, enableEmailAlerts: checked})
                          }
                          className="data-[state=checked]:bg-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Changes will apply immediately</span>
                  </div>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4 mr-2" /> Save Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
