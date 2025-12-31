
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubmitPageContent from "@/components/submit/SubmitPageContent";

const SubmitGroup = () => {
  return (
    <div className="flex flex-col min-h-screen font-sf-pro">
      <Navbar />
      <SubmitPageContent />
      <Footer />
    </div>
  );
};

export default SubmitGroup;
