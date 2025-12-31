import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare, Slack, Send } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/FileUpload";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { submitCommunity } from "@/lib/communityFlow";

// Form schema with more flexible validations
const formSchema = z.object({
  name: z.string().min(1, "Community name is required").max(100),
  platform: z.enum(["whatsapp", "slack", "discord", "telegram"]),
  category: z.string().min(1, "Please select a category"),
  shortDescription: z.string().min(1, "Short description is required").max(200),
  joinLink: z.string().min(1, "Join link is required").refine((url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return url.startsWith('http://') || url.startsWith('https://') || url.includes('.');
    }
  }, "Please enter a valid URL"),
  joinType: z.enum(["free", "paid"]).default("free"),
  priceInr: z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) return undefined;
      const n = typeof value === 'number' ? value : Number(value);
      return Number.isFinite(n) ? n : undefined;
    },
    z.number().int().min(10, "Minimum price is ₹10").max(100000, "Maximum price is ₹100000")
  ).optional(),
  founderName: z.string().min(1, "Your name is required"),
  founderBio: z.string().optional(),
  logoUrl: z.string().optional(),
  verified: z.boolean().default(false),
  showFounder: z.boolean().default(true),
}).superRefine((data, ctx) => {
  if (data.joinType === 'paid' && (data.priceInr === undefined || data.priceInr === null)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['priceInr'],
      message: 'Price is required for paid communities',
    });
  }
});

export type FormValues = z.infer<typeof formSchema>;

interface CommunityInformationFormProps {
  onFormValuesChange: (values: FormValues) => void;
}

const CommunityInformationForm = ({ onFormValuesChange }: CommunityInformationFormProps) => {
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      platform: "whatsapp",
      category: "",
      shortDescription: "",
      joinLink: "",
      joinType: "free",
      priceInr: undefined,
      founderName: "",
      founderBio: "",
      verified: false,
      showFounder: true,
    },
  });

  const joinTypeValue = form.watch("joinType");

  React.useEffect(() => {
    if (joinTypeValue === 'free') {
      form.setValue('priceInr', undefined);
    }
  }, [form, joinTypeValue]);

  // Update preview whenever form values change
  React.useEffect(() => {
    const subscription = form.watch((values) => {
      onFormValuesChange(values as FormValues);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onFormValuesChange]);

  // Handle file upload
  const handleFileUpload = (url: string) => {
    setLogoFile(url);
    form.setValue("logoUrl", url);
  };

  // Handle form submission
  const onSubmit = async (values: FormValues, event?: React.BaseSyntheticEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Validate required fields
    const requiredFields: Record<string, unknown> = {
      name: values.name?.trim(),
      category: values.category,
      shortDescription: values.shortDescription?.trim(),
      joinLink: values.joinLink?.trim(),
      founderName: values.founderName?.trim(),
      joinType: values.joinType,
    };

    if (values.joinType === 'paid') {
      requiredFields.priceInr = values.priceInr;
    }
    
    const emptyFields = Object.entries(requiredFields).filter(([key, value]) => !value);
    if (emptyFields.length > 0) {
      toast.error("Please complete all required fields", {
        description: "All fields marked with * are required",
      });
      return;
    }
    
    // Rate limiting
    const lastSubmission = localStorage.getItem('lastSubmissionTime');
    const now = Date.now();
    if (lastSubmission && (now - parseInt(lastSubmission)) < 10000) {
      const remainingTime = Math.ceil((10000 - (now - parseInt(lastSubmission))) / 1000);
      toast.error("Please wait a moment", {
        description: `You can submit again in ${remainingTime} seconds.`,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        toast.error("Service Unavailable", {
          description: "We're experiencing technical difficulties. Please try again later.",
        });
        throw new Error('Configuration error');
      }
      
      const submissionData = {
        community_name: values.name?.trim() || 'Unnamed Community',
        platform: values.platform || 'whatsapp',
        category: values.category || 'Other',
        short_description: values.shortDescription?.trim() || 'No description provided',
        long_description: values.shortDescription?.trim() || 'No description provided',
        join_link: values.joinLink?.trim() || 'https://example.com',
        join_type: values.joinType || 'free',
        price_inr: values.joinType === 'paid' ? (values.priceInr ?? null) : null,
        founder_name: values.founderName?.trim() || 'Anonymous',
        founder_bio: values.founderBio?.trim() || '',
        show_founder_info: values.showFounder ?? true,
        logo_url: values.logoUrl || null,
        status: "pending"
      };

      toast.loading("Processing submission...", { id: "submission-progress", duration: 15000 });
      
      let data, error;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;

        const submissionPromise = fetch('/.netlify/functions/marketplace-submit-community', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({ submission: submissionData }),
        }).then(async (res) => {
          const json = await res.json().catch(() => ({}));
          if (!res.ok) {
            const message = json?.error || json?.details || 'Submission failed';
            throw new Error(message);
          }
          return json;
        });
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const result: any = await Promise.race([submissionPromise, timeoutPromise]);
        data = result.submission;
        error = null;
      } catch (submitError) {
        error = submitError;
        data = null;
      }
      
      if (error) {
        toast.dismiss("submission-progress");
        
        let errorMessage = "We couldn't process your submission right now.";
        if (error.message?.includes('timeout')) {
          errorMessage = "The request is taking longer than expected. Please try again.";
        } else if (error.message?.includes('duplicate')) {
          errorMessage = "A community with this name already exists. Please choose a different name.";
        } else if (error.message?.includes('network')) {
          errorMessage = "Network connection issue. Please check your internet and try again.";
        }
        
        toast.error("Submission Failed", {
          description: errorMessage,
        });
        
        throw error;
      }
      
      // Send notification (non-blocking)
      fetch('/.netlify/functions/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          community_name: data.community_name,
          founder_name: data.founder_name,
          category: data.category,
          platform: data.platform,
          short_description: data.short_description,
          join_link: values.joinType === 'paid' ? values.joinLink : data.join_link,
          join_type: data.join_type,
          price_inr: data.price_inr,
          submitted_at: new Date().toISOString(),
          submission_id: data.id?.toString() || 'unknown'
        })
      }).catch(() => {});
      
      toast.dismiss("submission-progress");
      toast.success("Submission Received!", {
        description: "Thank you! We'll review your community and get back to you soon.",
        duration: 5000,
      });
      
      // Track analytics
      try {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'form_submit', {
            event_category: 'Community Submission',
            event_label: values.platform,
            value: 1
          });
        }
      } catch (e) {}
      
      localStorage.setItem('lastSubmissionTime', now.toString());
      form.reset();
      setIsSubmitted(true);
      
    } catch (error) {
      toast.dismiss("submission-progress");
      
      let errorMessage = "Please try again in a moment.";
      if (error.message?.includes('timeout')) {
        errorMessage = "The request is taking longer than expected. Please try again.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Network connection issue. Please check your internet.";
      } else if (error.message?.includes('duplicate')) {
        errorMessage = "A community with this name already exists.";
      }
      
      toast.error("Unable to Submit", {
        description: errorMessage,
        duration: 5000,
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-16 px-4 animate-in fade-in-90 slide-in-from-top-5">
        <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Submission Received
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md mx-auto">
          Thank you for submitting your community. Our team will review it and get back to you within 24-48 hours.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Community Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Community Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Startup Founders India" 
                  {...field} 
                  className="rounded-lg h-12 bg-gray-800/70 border-gray-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Platform */}
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="rounded-lg h-12 bg-gray-800/70 border-gray-700">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      WhatsApp
                    </div>
                  </SelectItem>
                  <SelectItem value="slack">
                    <div className="flex items-center gap-2">
                      <Slack className="h-4 w-4 text-purple-600" />
                      Slack
                    </div>
                  </SelectItem>
                  <SelectItem value="telegram">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-blue-600" />
                      Telegram
                    </div>
                  </SelectItem>
                  <SelectItem value="discord">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-blue-600" />
                      Discord
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="rounded-lg h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Creative">Creative</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="Health">Health & Wellness</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Short Description */}
        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief tagline for your community (max 150 characters)"
                  className="rounded-lg min-h-[60px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {field.value.length}/150 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="joinType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Join Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-gray-800 p-4 bg-gray-900/50">
                    <FormControl>
                      <RadioGroupItem value="free" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Free to Join
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-gray-800 p-4 bg-gray-900/50">
                    <FormControl>
                      <RadioGroupItem value="paid" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Paid to Join
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {joinTypeValue === 'free' && (
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              Free communities appear with a Free badge. Members can join instantly.
            </p>
          </div>
        )}

        {joinTypeValue === 'paid' && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="priceInr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (INR)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={10}
                        step={1}
                        placeholder="199"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="rounded-lg h-12 pl-8"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Set a one-time join price for your WhatsApp community.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 space-y-2">
              <p className="text-sm text-gray-300 leading-relaxed">
                Pricing guidance: keep it simple and accessible.
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Example: ₹199 is roughly the cost of a coffee + snack.
              </p>
            </div>
          </div>
        )}
        
        {/* Join Link */}
        <FormField
          control={form.control}
          name="joinLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Join Link / Landing Page</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://"
                  {...field}
                  className="rounded-lg h-12"
                />
              </FormControl>
              <FormDescription>
                Direct link where users can join your community
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Logo Upload */}
        <FormItem>
          <FormLabel>Community Logo</FormLabel>
          <FileUpload 
            onUpload={handleFileUpload} 
            currentImage={logoFile} 
          />
          <FormDescription>
            Upload a square logo or icon (recommended: 400x400px)
          </FormDescription>
        </FormItem>
        
        {/* Founder Section */}
        <div className="pt-4 border-t">
          <h3 className="font-medium text-lg mb-4">Founder Information</h3>
          
          {/* Founder Name */}
          <FormField
            control={form.control}
            name="founderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Founder Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    {...field}
                    className="rounded-lg h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Founder Bio */}
          <FormField
            control={form.control}
            name="founderBio"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Founder Bio (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A short bio about yourself (max 200 characters)"
                    className="rounded-lg min-h-[80px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value ? field.value.length : 0}/200 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Toggle Options */}
        <div className="pt-4 border-t space-y-4">
          <FormField
            control={form.control}
            name="verified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Request Verification
                  </FormLabel>
                  <FormDescription>
                    Apply for a verified badge for your community
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="showFounder"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Show Founder Profile
                  </FormLabel>
                  <FormDescription>
                    Display your profile on the community card
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-6 text-lg font-medium rounded-xl transition-all shadow-[0_0_0_0_rgba(0,118,255,.3)] hover:shadow-[0_0_0_6px_rgba(0,118,255,.3)]"
          >
            {isSubmitting ? "Processing..." : "Submit Community"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CommunityInformationForm;
