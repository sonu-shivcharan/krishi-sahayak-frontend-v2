import { useState } from "react";
import { 
  User, 
  MessageSquare, 
  Bell, 
  ArrowRight, 
  MapPin, 
  CheckCircle2, 
  BadgeHelp,
  Sprout,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@tanstack/react-router";
import { useFarmerQueries } from "../../hooks/useFarmerQueries";
import { useNotifications } from "../../hooks/useNotifications";
import { useAppAuth } from "@/providers/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryDetailsDialog } from "./QueryDetailsDialog";
import type { ForwardedQuery } from "../../hooks/useOfficerQueries";

export function FarmerDashboardView() {
  const { user } = useAppAuth();
  const { data: queries, isLoading: queriesLoading } = useFarmerQueries();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  const [selectedQueryForDetails, setSelectedQueryForDetails] = useState<ForwardedQuery | null>(null);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const recentQueries = queries?.slice(0, 3) || [];

  const handleNotificationClick = (n: any) => {
    if (!n.isRead) markAsRead(n._id);
    
    if (n.data?.queryId) {
      const query = queries?.find(q => q._id === n.data.queryId);
      if (query) {
        setSelectedQueryForDetails(query);
      }
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 border-primary/10">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {greeting()}, <span className="text-primary">{user?.name || "Farmer"}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative rounded-full border-primary/20 bg-background/50 backdrop-blur-sm">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 border-primary/10">
              <DropdownMenuLabel className="p-4 flex justify-between items-center">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs h-8 text-primary hover:text-primary/80" onClick={() => markAllAsRead()}>
                    Mark all read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-72">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="text-sm">No new notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <DropdownMenuItem 
                      key={n._id} 
                      className={`p-4 cursor-pointer focus:bg-primary/5 border-l-2 transition-colors ${n.isRead ? 'border-transparent' : 'border-primary bg-primary/5'}`}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-sm line-clamp-1">{n.title}</span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/chat">
            <Button className="rounded-full font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95">
              Ask AI Assistant
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Cards & Profile */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Profile Card */}
          <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-background to-primary/5 shadow-xl shadow-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20 ring-4 ring-primary/5">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{user?.role} Profile</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-background/50 border border-primary/5">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground/80">{user?.address || "Update your address"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-background/50 border border-primary/5">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground/80">{user?.email}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5" onClick={() => {}}>
                Edit Profile
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Action Card */}
          <Card className="border-primary/10 bg-primary/5 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeHelp className="h-5 w-5 text-primary" /> Need Expert Help?
              </CardTitle>
              <CardDescription>
                Forward your AI chat to a human agricultural officer for personalized advice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> Expert verification
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> Localized knowledge
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> Timely responses
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/chat" className="w-full">
                <Button className="w-full gap-2 group border-none bg-primary hover:bg-primary/90 text-white shadow-md">
                  Go to AI Assistant <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Recent Queries Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" /> Recent Queries
            </h2>
            <Link to="/app/queries">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-bold">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {queriesLoading ? (
              Array(2).fill(0).map((_, i) => (
                <Card key={i} className="border-primary/5 shadow-sm animate-pulse h-32" />
              ))
            ) : recentQueries.length === 0 ? (
              <Card className="border-dashed border-2 border-primary/10 bg-muted/30 p-12 flex flex-col items-center justify-center text-center gap-4">
                <BadgeHelp className="h-12 w-12 text-muted-foreground/30" />
                <p className="text-muted-foreground max-w-xs text-sm">No recent queries. Your forwarded questions will appear here.</p>
              </Card>
            ) : (
              recentQueries.map((query) => (
                <Card key={query._id} className="border-primary/5 hover:border-primary/20 transition-all hover:shadow-md group overflow-hidden">
                  <CardHeader className="p-4 pb-2 flex-row justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(query.forwardedAt), { addSuffix: true })}
                      </div>
                      <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors pr-10">
                        {query.originalQuery || `Query #${query._id.slice(-6)}`}
                      </CardTitle>
                    </div>
                    <Badge 
                      variant={query.status === 'answered' ? 'default' : 'secondary'}
                      className={`capitalize text-[10px] px-2 py-0 h-5 ${query.status === 'answered' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    >
                      {query.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-xs text-muted-foreground line-clamp-2 italic">
                      {query.summary ? `"${query.summary}"` : "No summary available."}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <QueryDetailsDialog 
        query={selectedQueryForDetails} 
        isOpen={!!selectedQueryForDetails} 
        onClose={() => setSelectedQueryForDetails(null)} 
      />
    </div>
  );
}
