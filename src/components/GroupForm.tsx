import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { SubmissionFormData } from "@/types/submission";
import { useSubmissions } from "@/contexts/SubmissionContext";

const GroupForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLinks, setSocialLinks] = useState<string[]>([]);
  const [currentLink, setCurrentLink] = useState("");
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const { addSubmission } = useSubmissions();
  
  const [formData, setFormData] = useState<SubmissionFormData>({
    name: "",
    description: "",
    category: "",
    contact_email: "",
    website: "",
    social_links: [],
  });

  const categories = [
    "Business", "Technology", "Design", "Marketing", 
    "Finance", "Health", "Education", "Entertainment", "Other"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const addSocialLink = () => {
    if (currentLink.trim() && !socialLinks.includes(currentLink.trim())) {
      const newLinks = [...socialLinks, currentLink.trim()];
      setSocialLinks(newLinks);
      setFormData((prev) => ({ ...prev, social_links: newLinks }));
      setCurrentLink("");
    }
  };

  const removeSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
    setFormData((prev) => ({ ...prev, social_links: newLinks }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a service like Cloudinary or S3
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLogoFile(result);
        setFormData((prev) => ({ ...prev, logo_url: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate required fields
    if (!formData.name.trim() || !formData.description.trim() || 
        !formData.category || !formData.contact_email.trim()) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Save submission using context
    try {
      addSubmission({
        ...formData,
        logo_url: logoFile || undefined,
      });

      toast.success("Community submitted successfully!", {
        description: "We'll review your submission and get back to you within 48 hours."
      });
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        contact_email: "",
        website: "",
        social_links: [],
      });
      setSocialLinks([]);
      setLogoFile(null);
    } catch (error) {
      toast.error("Failed to submit community. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <section className="py-16" id="submit">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-4xl font-bold text-white">Submit Your Community</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join our curated platform and connect with like-minded individuals. 
            All submissions are reviewed to ensure quality.
          </p>
        </div>
        
        <Card className="max-w-3xl mx-auto bg-gray-900/60 border-gray-800 hover-beam">
          <CardHeader>
            <CardTitle className="text-white">Community Details</CardTitle>
            <CardDescription className="text-gray-400">
              Tell us about your community. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Community Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Community Name *</Label>
                  <Input 
                    id="name"
                    name="name"
                    placeholder="e.g., Mumbai Startup Network"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-gray-800/70 border-gray-700 text-white"
                    required
                  />
                </div>
                
                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Category *</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="bg-gray-800/70 border-gray-700 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Description *</Label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Describe your community, its purpose, and what members can expect..."
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-gray-800/70 border-gray-700 text-white min-h-[120px]"
                  required
                />
                <p className="text-sm text-gray-500">
                  {formData.description.length}/500 characters
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Email */}
                <div className="space-y-2">
                  <Label htmlFor="contact_email" className="text-gray-300">Contact Email *</Label>
                  <Input 
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    placeholder="admin@yourcommunity.com"
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="bg-gray-800/70 border-gray-700 text-white"
                    required
                  />
                </div>
                
                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-gray-300">Website</Label>
                  <Input 
                    id="website"
                    name="website"
                    placeholder="https://yourcommunity.com"
                    value={formData.website}
                    onChange={handleChange}
                    className="bg-gray-800/70 border-gray-700 text-white"
                  />
                </div>
              </div>
              
              {/* Social Links */}
              <div className="space-y-2">
                <Label className="text-gray-300">Social Links</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add social media or group links"
                    value={currentLink}
                    onChange={(e) => setCurrentLink(e.target.value)}
                    className="bg-gray-800/70 border-gray-700 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSocialLink())}
                  />
                  <Button 
                    type="button" 
                    onClick={addSocialLink}
                    variant="outline"
                    className="border-gray-700 hover-beam"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {socialLinks.map((link, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-gray-800 text-gray-300 pr-1"
                      >
                        {link}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 hover:bg-gray-700"
                          onClick={() => removeSocialLink(index)}
                        >
                          <X size={12} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="text-gray-300">Community Logo</Label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover-beam">
                  {logoFile ? (
                    <div className="relative inline-block">
                      <img 
                        src={logoFile} 
                        alt="Logo preview" 
                        className="h-24 w-24 object-cover rounded-lg mx-auto"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => {
                          setLogoFile(null);
                          setFormData((prev) => ({ ...prev, logo_url: undefined }));
                        }}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 mb-2">Drop your logo here or click to browse</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Label 
                        htmlFor="logo-upload" 
                        className="cursor-pointer bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg inline-block hover-beam"
                      >
                        Choose File
                      </Label>
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-medium hover-beam"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Community for Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default GroupForm;
