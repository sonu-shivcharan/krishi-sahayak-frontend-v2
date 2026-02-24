import { 
  CheckCircle2, 
  Clock, 
} from "lucide-react";
import { format } from "date-fns";
import type { ForwardedQuery } from "../../hooks/useOfficerQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Streamdown } from "streamdown";

interface QueryDetailsDialogProps {
  query: ForwardedQuery | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QueryDetailsDialog({ query, isOpen, onClose }: QueryDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 glassmorphism border-primary/20 text-foreground">
        {query && (
          <>
            <DialogHeader className="p-6 pb-2 text-left">
              <div className="flex justify-between items-start">
                <DialogTitle className="text-2xl font-bold text-primary">Query Details</DialogTitle>
                <Badge variant={query.status === 'answered' ? 'default' : 'secondary'} className="capitalize">
                  {query.status}
                </Badge>
              </div>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4" />
                Forwarded on {format(new Date(query.forwardedAt), "PPP p")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
              <div className="space-y-6 pb-6">
                {/* Original Question */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your Original Question</h4>
                  <div className="p-4 rounded-xl bg-muted/50 border border-primary/5">
                    <p className="text-foreground leading-relaxed">
                      {query.originalQuery || query.question}
                    </p>
                  </div>
                </div>

                {/* Summary if exists */}
                {query.summary && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Context Summary</h4>
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 italic text-sm text-muted-foreground">
                      <Streamdown>{query.summary}</Streamdown>
                    </div>
                  </div>
                )}

                {/* Answer */}
                {query.status === 'answered' && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Expert Recommendation
                    </h4>
                    <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/20 shadow-inner">
                      <div className="prose prose-sm prose-primary dark:prose-invert max-w-none">
                        <Streamdown>{query.answer || ""}</Streamdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pending Message */}
                {query.status === 'pending' && (
                  <div className="p-8 text-center flex flex-col items-center gap-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                    <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-amber-500 animate-spin-slow" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-600">Still in Review</h4>
                      <p className="text-sm text-muted-foreground mt-1 px-4">
                        Our experts are currently analyzing your query. You'll receive a notification as soon as an answer is provided.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 pt-2 border-t border-primary/10 flex justify-end">
              <Button onClick={onClose} className="rounded-full px-8">
                Close Details
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
