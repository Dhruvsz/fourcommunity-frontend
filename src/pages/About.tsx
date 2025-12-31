import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Target, Heart, Shield, Globe, Award, TrendingUp } from "lucide-react";
import { BackToTop } from "@/components/BackToTop";

const About = () => {
  const navigate = useNavigate();

  // Set page title
  React.useEffect(() => {
    document.title = "About Us - GroupFinder";
  }, []);

  const values = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community First",
      description: "We believe in the power of meaningful connections and authentic communities."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Quality Over Quantity",
      description: "We curate only the best communities to ensure valuable experiences for our users."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Trust & Safety",
      description: "Every community is verified and monitored to maintain high standards."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Reach",
      description: "Connecting people from around the world through shared interests and goals."
    }
  ];

  const stats = [
    { number: "500+", label: "Communities", icon: <Users className="h-6 w-6" /> },
    { number: "50K+", label: "Members", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "95%", label: "Satisfaction", icon: <Heart className="h-6 w-6" /> },
    { number: "24/7", label: "Support", icon: <Award className="h-6 w-6" /> }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former startup founder with a passion for building meaningful communities. Led 3 successful exits.",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Tech leader with 10+ years building scalable platforms. Previously at Airbnb and Google.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emma Rodriguez",
      role: "Head of Community",
      bio: "Community builder and former Slack admin. Expert in fostering engaged online communities.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "David Kim",
      role: "Head of Product",
      bio: "Product strategist focused on user experience. Previously led product at Discord and Telegram.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#131316] text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 pt-32">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About GroupFinder</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to connect people through meaningful communities. 
              Our platform curates the best WhatsApp, Slack, and Telegram groups 
              to help you find your tribe.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="bg-[#1C1C1F] border-gray-700/40 text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-3 text-primary">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  In today's digital age, finding authentic communities can be challenging. 
                  We believe that meaningful connections happen in the right groups, 
                  with the right people, discussing the right topics.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  GroupFinder was born from the frustration of joining countless 
                  low-quality groups. We decided to create a platform that only 
                  features communities that meet our high standards for engagement, 
                  moderation, and value.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Whether you're a startup founder looking for peer support, 
                  a developer wanting to learn new technologies, or someone 
                  passionate about a specific hobby, we help you find your tribe.
                </p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-4">What We Do</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">Curate high-quality communities across multiple platforms</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">Verify community authenticity and engagement levels</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">Provide detailed insights and member counts</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">Support community leaders in growing their groups</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="bg-[#1C1C1F] border-gray-700/40">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-primary flex-shrink-0">
                        {value.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-gray-400">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="bg-[#1C1C1F] border-gray-700/40 text-center">
                  <CardContent className="p-6">
                    <img
                      src={member.avatar}
                      alt={`${member.name} profile picture`}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                    <Badge variant="outline" className="mb-3 bg-primary/20 text-primary border-primary/30">
                      {member.role}
                    </Badge>
                    <p className="text-gray-400 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">Ready to Find Your Community?</h2>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of people who have already discovered amazing communities 
                  through GroupFinder. Start your journey today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate("/communities")}
                    className="px-8 py-3 text-lg"
                  >
                    Browse Communities
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/contact")}
                    className="px-8 py-3 text-lg"
                  >
                    Get in Touch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default About; 