import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Slack, Send, ExternalLink, X, Eye, BookmarkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

// Enhanced group data with additional fields
const exampleGroups = [
  {
    name: "Startup Founders India",
    category: "Business",
    description: "Connect with other founders, share resources, and get advice on growing your startup in India.",
    members: 486,
    location: "India",
    verified: true,
    platform: "whatsapp",
    foundedDate: "May 2023",
    admin: "Dhruv Choudhary",
    logo: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&q=80",
    hasLink: true
  },
  {
    name: "Stock Traders Daily",
    category: "Finance",
    description: "Daily market insights, stock tips, and trading strategies for both beginners and pros.",
    members: 1253,
    location: "Global",
    verified: true,
    platform: "slack",
    foundedDate: "Jan 2022",
    admin: "Priya Mehta",
    logo: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&q=80",
    hasLink: true
  },
  {
    name: "Mumbai Creators Network",
    category: "Creative",
    description: "A community for content creators, designers, and artists in Mumbai to collaborate and share opportunities.",
    members: 742,
    location: "Mumbai",
    verified: true,
    platform: "whatsapp",
    foundedDate: "Nov 2023",
    admin: "Rahul Sharma",
    logo: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&q=80",
    hasLink: false
  },
  {
    name: "Tech Freelancers Hub",
    category: "Technology",
    description: "Freelance developers, designers, and IT professionals sharing gigs, tips, and career advice.",
    members: 935,
    location: "Global",
    verified: true,
    platform: "telegram",
    foundedDate: "Mar 2022",
    admin: "Aditya Patel",
    logo: "https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop&q=80",
    hasLink: true
  },
  {
    name: "Digital Nomads Asia",
    category: "Lifestyle",
    description: "Remote workers and digital nomads sharing tips on working while traveling across Asia.",
    members: 618,
    location: "Asia",
    verified: false,
    platform: "whatsapp",
    foundedDate: "Aug 2022",
    admin: "Maya Lin",
    logo: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&q=80",
    hasLink: false
  }
];

// Platform icon component
const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'whatsapp':
      return <MessageSquare className="h-4 w-4 text-green-600" />;
    case 'slack':
      return <Slack className="h-4 w-4 text-purple-600" />;
    case 'telegram':
      return <Send className="h-4 w-4 text-blue-600" />;
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
};

// Request invite form component
const RequestInviteForm = ({ group, onClose }: { group: any, onClose: () => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', reason: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Request submitted:', formData);
    alert('Your request has been submitted!');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input 
          id="name" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={formData.email} 
          onChange={e => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="reason">Why do you want to join?</Label>
        <Textarea 
          id="reason" 
          value={formData.reason} 
          onChange={e => setFormData({...formData, reason: e.target.value})}
          required
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Submit Request</Button>
      </DialogFooter>
    </form>
  );
};

// Component for displaying community details in a modal or drawer
const CommunityDetails = ({ 
  group, 
  onClose 
}: { 
  group: typeof exampleGroups[0], 
  onClose: () => void 
}) => {
  const [viewerCount, setViewerCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Simulate random viewer count that changes occasionally
  useEffect(() => {
    // Initial random count between 3 and 25
    setViewerCount(Math.floor(Math.random() * 23) + 3);
    
    // Update viewer count every 20-40 seconds
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      setViewerCount(prev => Math.max(2, prev + change));
    }, Math.random() * 20000 + 20000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 px-1 py-2 md:px-2">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={group.logo} alt={group.name} />
            <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{group.name}</h2>
              {group.verified && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="mt-1 flex items-center gap-2 text-muted-foreground">
              <span>{group.category}</span>
              <span className="inline-flex items-center gap-1">
                <PlatformIcon platform={group.platform} />
                {group.platform.charAt(0).toUpperCase() + group.platform.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Eye size={14} />
                <span className="text-xs">{viewerCount}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <p className="text-sm">{viewerCount} people viewing now</p>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
          >
            <BookmarkIcon className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
          </Button>
          
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </div>
      </div>
      
      <div className="rounded-md bg-secondary/50 p-4">
        <p className="text-lg">{group.description}</p>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <Eye className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-muted-foreground">
          {viewerCount} people are viewing this now
        </span>
      </div>
      
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-medium">👤 Created by</TableCell>
            <TableCell>{group.admin}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">📍 Location</TableCell>
            <TableCell>{group.location}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">🗓 Since</TableCell>
            <TableCell>{group.foundedDate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">👥 Members</TableCell>
            <TableCell>{group.members} members</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">💬 Platform</TableCell>
            <TableCell className="flex items-center gap-2">
              <PlatformIcon platform={group.platform} />
              {group.platform.charAt(0).toUpperCase() + group.platform.slice(1)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">💼 Category</TableCell>
            <TableCell>{group.category}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={group.logo} alt={group.admin} />
            <AvatarFallback>{group.admin.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div>
            <h4 className="font-semibold">Created by {group.admin}</h4>
            <p className="text-sm text-muted-foreground">
              {group.admin} is passionate about building communities that connect like-minded individuals.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        {group.hasLink ? (
          <Button className="w-full text-base py-6" asChild>
            <a href="#join">Join Now</a>
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full text-base py-6">Request Invite</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request to join {group.name}</DialogTitle>
                <DialogDescription>
                  Fill out this form to request an invite to this community.
                </DialogDescription>
              </DialogHeader>
              <RequestInviteForm 
                group={group} 
                onClose={() => onClose()}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

const ExampleGroups = () => {
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const isMobile = useIsMobile();

  return (
    <section className="py-16 font-sf-pro">
      <div className="container">
        <div className="text-center mb-6">
          <h2 className="mb-4">Featured Communities</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">
            Discover some of the popular communities already on our platform.
            Join the waitlist to get access when we launch.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            These are verified and active communities across platforms like WhatsApp, Slack, and more. 
            You can join instantly or request an invite.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exampleGroups.map((group, index) => (
            <Drawer key={index} open={selectedGroup === index} onOpenChange={(open) => {
              if (open) setSelectedGroup(index);
              else setSelectedGroup(null);
            }}>
              <DrawerTrigger asChild>
                <Card 
                  className="h-full flex flex-col transition-all duration-200 hover:shadow-md cursor-pointer"
                  onClick={() => setSelectedGroup(index)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={group.logo} alt={group.name} />
                          <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="flex items-center gap-2 text-xl">
                            {group.name}
                            {group.verified && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                Verified
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center gap-2">
                            <span>{group.category}</span>
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
                            <span className="text-xs">{Math.floor(Math.random() * 20) + 2}</span>
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
                    {group.hasLink ? (
                      <Button className="w-full" asChild>
                        <a href="#join">Join Now</a>
                      </Button>
                    ) : (
                      <Dialog open={openDialogId === index} onOpenChange={(open) => {
                        // Handle dialog opening/closing
                        setOpenDialogId(open ? index : null);
                        // Stop propagation to prevent drawer from opening
                        if (open) setSelectedGroup(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDialogId(index);
                              setSelectedGroup(null);
                            }}
                          >
                            Request Invite
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request to join {group.name}</DialogTitle>
                            <DialogDescription>
                              Fill out this form to request an invite to this community.
                            </DialogDescription>
                          </DialogHeader>
                          <RequestInviteForm 
                            group={group} 
                            onClose={() => setOpenDialogId(null)} 
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardFooter>
                </Card>
              </DrawerTrigger>
              
              <DrawerContent className="max-h-[90vh] overflow-y-auto">
                <CommunityDetails 
                  group={group} 
                  onClose={() => setSelectedGroup(null)}
                />
              </DrawerContent>
            </Drawer>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExampleGroups;
