import { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  BadgeHelp,
  Sprout,
  ArrowRight,
  MapPin
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@tanstack/react-router";
import { useFarmerQueries } from "../../hooks/useFarmerQueries";
import type { ForwardedQuery } from "../../hooks/useOfficerQueries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryDetailsDialog } from "./QueryDetailsDialog";

export function FarmerQueriesView() {
  const { data: queries, isLoading: queriesLoading } = useFarmerQueries();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'queries' | 'answered'>('overview');
  const [selectedQueryForDetails, setSelectedQueryForDetails] = useState<ForwardedQuery | null>(null);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between border-b pb-6 border-primary/10">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sprout className="h-6 w-6 text-primary" /> My Forwarded Queries
        </h2>
        <div className="flex bg-muted p-1 rounded-lg">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-8 px-4 rounded-md text-xs font-semibold"
            onClick={() => setActiveTab('overview')}
          >
            All
          </Button>
          <Button 
            variant={activeTab === 'queries' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-8 px-4 rounded-md text-xs font-semibold"
            onClick={() => setActiveTab('queries')}
          >
            Pending
          </Button>
          <Button 
            variant={activeTab === 'answered' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-8 px-4 rounded-md text-xs font-semibold"
            onClick={() => setActiveTab('answered')}
          >
            Answered
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-14rem)] rounded-2xl border border-primary/10 bg-card shadow-inner">
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
                <p className="text-muted-foreground max-w-xs">You haven't forwarded any queries yet.</p>
              </div>
              <Link to="/chat">
                <Button variant="outline" className="mt-2 border-primary/20">Ask AI First</Button>
              </Link>
            </div>
          ) : (
            queries?.filter((q: ForwardedQuery) => {
              if (activeTab === 'overview') return true;
              if (activeTab === 'queries') return q.status === 'pending';
              if (activeTab === 'answered') return q.status === 'answered';
              return true;
            }).map((query: ForwardedQuery) => (
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
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="px-0 h-auto mt-2 text-primary font-bold hover:no-underline"
                        onClick={() => setSelectedQueryForDetails(query)}
                      >
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

      <QueryDetailsDialog 
        query={selectedQueryForDetails} 
        isOpen={!!selectedQueryForDetails} 
        onClose={() => setSelectedQueryForDetails(null)} 
      />
    </div>
  );
}
