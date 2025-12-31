
import React from "react";
import { GroupPreview } from "@/components/GroupPreview";
import { FormValues } from "@/components/submit/CommunityInformationForm";

interface LivePreviewProps {
  previewData: FormValues | null;
  logoFile: string | null;
}

const LivePreview = ({ previewData, logoFile }: LivePreviewProps) => {
  if (!previewData) return null;
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Live Preview</h3>
        <p className="text-gray-400 text-sm">
          This is how your community will appear on our platform
        </p>
      </div>
      
      <div className="rounded-xl overflow-hidden border border-gray-800 shadow-sm bg-gray-900/50 backdrop-blur-sm">
        <GroupPreview 
          group={{
            name: previewData.name || "Your Community Name",
            category: previewData.category || "Category",
            description: previewData.shortDescription || "Brief description of your community will appear here...",
            platform: previewData.platform,
            members: 0,
            location: "Global",
            verified: previewData.verified,
            admin: previewData.founderName || "Your Name",
            logo: logoFile || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&q=80",
            foundedDate: "New",
            hasLink: true,
            founderBio: previewData.founderBio || "",
            joinType: previewData.joinType,
            priceInr: previewData.joinType === 'paid' ? (previewData.priceInr ?? null) : null,
          }}
        />
      </div>
    </div>
  );
};

export default LivePreview;
