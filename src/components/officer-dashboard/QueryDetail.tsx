import { useState } from "react";
import { format } from "date-fns";
import type { ForwardedQuery } from "../../hooks/useOfficerQueries";
import { useAnswerQuery, useUser } from "../../hooks/useOfficerQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Mail, User as UserIcon } from "lucide-react";

import { Streamdown } from "streamdown";

interface QueryDetailProps {
  query: ForwardedQuery;
}

function UserProfileDialog({ userId, open, onOpenChange }: { userId: string, open: boolean, onOpenChange: (open: boolean) => void }) {
  const { data: user, isLoading, isError } = useUser(userId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Farmer Profile</DialogTitle>
          <DialogDescription>
            Detailed information about the user who requested assistance.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : isError ? (
          <div className="py-4 text-center text-destructive">
            Failed to load user profile.
          </div>
        ) : user ? (
          <div className="flex flex-col gap-6 py-4">
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name?.charAt(0) || <UserIcon size={20} />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h4 className="text-xl font-bold">{user.name}</h4>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail size={14} className="opacity-70" />
                  {user.email}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={12} />
                  Location Details
                </span>
                <p className="text-sm font-medium">
                  {user.address || "No specific address provided"}
                </p>
                {user.location && (
                  <p className="text-xs text-muted-foreground">
                    {[user.location.taluka, user.location.district].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <UserIcon size={12} />
                  Role
                </span>
                <Badge variant="outline" className="w-fit capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export function QueryDetail({ query }: QueryDetailProps) {
  const [answer, setAnswer] = useState(query.answer || "");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const answerMutation = useAnswerQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    answerMutation.mutate({
      queryId: query._id,
      answer: answer.trim(),
    });
  };

  return (
    <div className="flex h-full flex-col">
      <UserProfileDialog 
        userId={query.forwardedBy?._id} 
        open={isProfileOpen} 
        onOpenChange={setIsProfileOpen} 
      />
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h3 
              className="text-lg font-semibold hover:text-primary cursor-pointer transition-colors flex items-center gap-1"
              onClick={() => setIsProfileOpen(true)}
            >
              {query.forwardedBy?.name || query.userContext?.userName || "Unknown Farmer"}
              <UserIcon size={14} className="opacity-40" />
            </h3>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm text-muted-foreground">
                {[query.location?.taluka, query.location?.district].filter(Boolean).join(", ") || 
                 query.forwardedBy?.address || 
                 query.userContext?.location || 
                 "No location provided"}
              </p>
              {(query.forwardedBy?.email || query.forwardedBy?.phone) && (
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                  {query.forwardedBy?.email && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="opacity-70">Email:</span> {query.forwardedBy.email}
                    </p>
                  )}
                  {query.forwardedBy?.phone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="opacity-70">Phone:</span> {query.forwardedBy.phone}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant={query.status === "answered" ? "default" : "secondary"}>
            {query.status.toUpperCase()}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {format(new Date(query.forwardedAt), "PPp")}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-6">
          {query.summary && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 shadow-sm">
              <h4 className="mb-2 font-semibold text-xs text-primary uppercase tracking-wider flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                Officer Summary & Action Required
              </h4>
              <div className="text-sm leading-relaxed text-foreground/90 prose-sm prose-primary dark:prose-invert max-w-none">
                <Streamdown>{query.summary}</Streamdown>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-medium text-sm text-muted-foreground uppercase tracking-wider">
              Original Query
            </h4>
            <p className="text-sm leading-relaxed">{query.originalQuery}</p>
          </div>

          <Separator />

          {query.relevantMessages && query.relevantMessages.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                Conversation Context
              </h4>
              <div className="flex flex-col gap-3">
                {query.relevantMessages.map((msg: any, index: number) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-1 rounded-lg p-3 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground ml-12"
                        : "bg-muted mr-12"
                    }`}
                  >
                    <span className="font-semibold text-xs opacity-70">
                      {msg.role === "user" ? "Farmer" : "Assistant"}
                    </span>
                    <p className="leading-snug">{msg.content}</p>
                  </div>
                ))}
              </div>
              <Separator className="mt-2" />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-card p-4">
        {query.status === "answered" ? (
          <div className="flex flex-col gap-2 rounded-lg border bg-green-50/50 p-4 dark:bg-green-900/10 dark:border-green-900/50">
            <h4 className="font-medium text-green-800 dark:text-green-300">Your Answer:</h4>
            <div className="text-sm text-green-900 dark:text-green-100 prose-sm prose-primary dark:prose-invert max-w-none">
              <Streamdown>{query.answer}</Streamdown>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="answer" className="text-sm font-medium">
                Provide an Answer/Recommendation
              </label>
              <Textarea
                id="answer"
                placeholder="Type your expert advice here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[120px] resize-y"
                disabled={answerMutation.isPending}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={answerMutation.isPending || !answer.trim()}>
                {answerMutation.isPending ? "Submitting..." : "Submit Answer"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
