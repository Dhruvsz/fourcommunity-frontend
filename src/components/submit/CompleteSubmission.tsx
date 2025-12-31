import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { FormValues } from "@/components/submit/CommunityInformationForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import components
import CommunityInformationForm from "@/components/submit/CommunityInformationForm";
import LivePreview from "@/components/submit/LivePreview";
import { BackToTop } from "@/components/BackToTop";

const CompleteSubmission = () => {
  const [previewData, setPreviewData] = useState<FormValues | null>(null);
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Set page title and meta for SEO
  useEffect(() => {
    document.title = "Complete Your Submission - GroupFinder";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Complete your community submission with detailed information. Get your community featured on our platform.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Complete your community submission with detailed information. Get your community featured on our platform.";
      document.head.appendChild(meta);
    }
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const handleFormValuesChange = (values: FormValues) => {
    setPreviewData(values);
    if (values.logoUrl) {
      setLogoFile(values.logoUrl);
    }
  };

  return (
    <motion.main 
      className="flex-1 bg-black min-h-screen pt-8 md:pt-16 px-2 md:px-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header with back button */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="container max-w-4xl md:max-w-5xl py-6 md:py-10 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/submit")}
              className="text-gray-400 hover:text-white w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-base md:text-lg">Back to Submit</span>
            </Button>
            <div className="flex flex-col gap-1 md:gap-2">
              <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">Complete Your Submission</h1>
              <p className="text-gray-400 text-sm md:text-lg max-w-2xl">
                Provide all the details about your community to help us review and feature it
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="container max-w-4xl md:max-w-5xl py-8 md:py-16 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center min-h-[60vh]">
          {/* Form Section */}
          <motion.div 
            variants={itemVariants} 
            className="mb-8 md:mb-0 md:col-span-3 flex"
          >
            <Card className="flex-1 shadow-2xl border border-gray-800 bg-gray-900/70 backdrop-blur-xl rounded-2xl min-h-[420px] md:min-h-[500px] flex flex-col justify-center">
              <CardHeader className="border-b border-gray-800 bg-gray-900/70 rounded-t-2xl">
                <CardTitle className="text-xl md:text-2xl font-bold">Community Information</CardTitle>
                <CardDescription className="text-gray-400 text-sm md:text-base">
                  Fill out the details about your community
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-8 flex-1 flex flex-col justify-center">
                <CommunityInformationForm onFormValuesChange={handleFormValuesChange} />
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Preview Section */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 md:sticky top-24 h-fit flex"
          >
            <Card className="flex-1 shadow-2xl border border-gray-800 bg-gray-900/70 backdrop-blur-xl rounded-2xl min-h-[420px] md:min-h-[500px] flex flex-col justify-center">
              <CardContent className="p-4 md:p-8 flex-1 flex flex-col justify-center">
                <LivePreview previewData={previewData} logoFile={logoFile} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      <BackToTop />
    </motion.main>
  );
};

export default CompleteSubmission; 