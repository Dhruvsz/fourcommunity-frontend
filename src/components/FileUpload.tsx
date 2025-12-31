
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentImage: string | null;
}

export const FileUpload = ({ onUpload, currentImage }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  // Upload file to Supabase Storage
  const uploadFile = async (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setIsLoading(true);

    try {
      // For now, create a data URL as fallback
      // In production, you would upload to Supabase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Pass the data URL to parent component
        onUpload(result);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle remove image
  const handleRemove = () => {
    onUpload("");
  };

  // Handle button click to trigger file input
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {currentImage ? (
        <div className="relative w-full rounded-lg border border-input overflow-hidden">
          <img 
            src={currentImage} 
            alt="Uploaded logo" 
            className="w-full h-48 object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full opacity-90"
            onClick={handleRemove}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-input hover:bg-muted/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-2">
              <p className="font-medium">
                {isLoading ? "Uploading..." : "Drag & drop an image here"}
              </p>
              <p className="text-xs text-muted-foreground">
                SVG, PNG, JPG or GIF (max. 2MB)
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <Button 
                variant="outline" 
                className="mt-2" 
                disabled={isLoading}
                type="button"
                onClick={handleButtonClick}
              >
                {isLoading ? "Processing..." : "Select File"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
