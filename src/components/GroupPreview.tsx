
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MessageSquare, Send, Slack } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Define the platform icon component
const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'whatsapp':
      return <MessageSquare className="h-4 w-4 text-green-600" />;
    case 'slack':
      return <Slack className="h-4 w-4 text-purple-600" />;
    case 'telegram':
      return <Send className="h-4 w-4 text-blue-600" />;
    case 'discord':
      // Use MessageSquare as fallback for Discord since Discord icon is not available
      return <MessageSquare className="h-4 w-4 text-indigo-600" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

// Define the group type
interface GroupPreviewProps {
  group: {
    name: string;
    category: string;
    description: string;
    platform: string;
    members: number;
    location: string;
    verified: boolean;
    admin: string;
    logo: string;
    foundedDate: string;
    hasLink: boolean;
    founderBio?: string;
    joinType?: 'free' | 'paid';
    priceInr?: number | null;
  };
}

export const GroupPreview = ({ group }: GroupPreviewProps) => {
  const viewerCount = Math.floor(Math.random() * 20) + 2; // Random viewer count
  
  return (
    <Card className="h-full flex flex-col transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={group.logo} alt={group.name} />
              <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                {group.name || "Community Name"}
                {group.verified && (
                  <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-700 text-xs">
                    Verified
                  </Badge>
                )}
                {group.joinType === 'paid' ? (
                  <Badge variant="outline" className="bg-emerald-900/40 text-emerald-300 border-emerald-700 text-xs">
                    {typeof group.priceInr === 'number' && group.priceInr > 0 
                      ? `Paid – ₹${group.priceInr}` 
                      : 'Paid to Join'}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700 text-xs">
                    Free to Join
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-2">
                <span>{group.category || "Category"}</span>
                <span className="inline-flex items-center gap-1">
                  <PlatformIcon platform={group.platform} />
                  {group.platform.charAt(0).toUpperCase() + group.platform.slice(1)}
                </span>
              </CardDescription>
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 h-7">
                <Eye size={14} />
                <span className="text-xs">{viewerCount}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <p className="text-sm">People viewing now</p>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pt-2">
        <p className="line-clamp-2">{group.description}</p>
        
        <div className="mt-4 text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-5">👤</span>
            <span>Created by {group.admin}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-5">🕐</span>
            <span>Since {group.foundedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-5">👥</span>
            <span>{group.members} members</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-5">🌍</span>
            <span>{group.location}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button className="w-full" asChild>
          <a href="#join">
            {group.joinType === 'paid' && typeof group.priceInr === 'number' && group.priceInr > 0
              ? `Join for ₹${group.priceInr}`
              : group.joinType === 'paid'
              ? 'Join (Paid)'
              : 'Join Now'}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
