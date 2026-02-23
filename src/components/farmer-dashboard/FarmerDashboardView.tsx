import { useState } from "react";
import { 
  User, 
  MessageSquare, 
  Bell, 
  ArrowRight, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  BadgeHelp,
  Leaf,
  Sprout
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

export function FarmerDashboardView() {
  const { user } = useAppAuth();
  const { data: queries, isLoading: queriesLoading } = useFarmerQueries();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'queries'>('overview');

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 border-primary/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Leaf className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {greeting()}, <span className="text-primary">{user?.name || "Farmer"}</span>
            </h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" /> {user?.address || "Location not set"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-12 w-12 rounded-xl border-primary/20 bg-background/50 backdrop-blur-sm">
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
                      onClick={() => !n.isRead && markAsRead(n._id)}
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
            <Button className="h-12 px-6 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
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

        {/* Right Column: Forwarded Queries */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" /> Forwarded to Officers
            </h2>
            <div className="flex bg-muted p-1 rounded-lg">
              <Button 
                variant={activeTab === 'overview' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="h-8 px-4 rounded-md text-xs font-semibold"
                onClick={() => setActiveTab('overview')}
              >
                All Queries
              </Button>
              <Button 
                variant={activeTab === 'queries' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="h-8 px-4 rounded-md text-xs font-semibold"
                onClick={() => setActiveTab('queries')}
              >
                Pending
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[600px] rounded-2xl border border-primary/10 bg-card shadow-inner">
            <div className="p-4 flex flex-col gap-4">
              {queriesLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="border-none shadow-sm animate-pulse">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-5 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardFooter>
                      <Skeleton className="h-8 w-20" />
                    </CardFooter>
                  </Card>
                ))
              ) : queries?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <div className="p-6 bg-muted rounded-full">
                    <BadgeHelp className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">No Queries Found</h3>
                    <p className="text-muted-foreground max-w-xs">You haven't forwarded any queries to our experts yet. Use the AI Chat to get started!</p>
                  </div>
                  <Link to="/chat">
                    <Button variant="outline" className="mt-2 border-primary/20">Ask AI First</Button>
                  </Link>
                </div>
              ) : (
                queries?.filter(q => activeTab === 'overview' || q.status === 'pending').map((query) => (
                  <Card key={query._id} className="border-primary/5 hover:border-primary/20 transition-all hover:shadow-md group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <Badge 
                        variant={query.status === 'answered' ? 'default' : 'secondary'}
                        className={`capitalize px-3 py-1 ${query.status === 'answered' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                      >
                        {query.status}
                      </Badge>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(query.forwardedAt), { addSuffix: true })}
                        {query.location?.district && (
                          <>
                            <span className="mx-1">•</span>
                            <MapPin className="h-3 w-3" />
                            {query.location.district}
                          </>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {query.originalQuery || `Query #${query._id.slice(-6)}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      {query.summary && (
                        <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground line-clamp-3 italic">
                          "{query.summary}"
                        </div>
                      )}
                      
                      {query.status === 'answered' && (
                        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Expert Response</span>
                          </div>
                          <p className="text-sm text-foreground line-clamp-4 leading-relaxed">
                            {query.answer}
                          </p>
                          <Button variant="link" size="sm" className="px-0 h-auto mt-2 text-primary font-bold hover:no-underline">
                            Read Full Answer <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between items-center text-xs text-muted-foreground border-t border-primary/5 pt-3 mt-1">
                      <span>Ref: {query._id.slice(-8).toUpperCase()}</span>
                      {query.status === 'pending' && (
                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                          <Clock className="h-3 w-3 animate-spin-slow" />
                          Expert is reviewing...
                        </span>
                      )}
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
