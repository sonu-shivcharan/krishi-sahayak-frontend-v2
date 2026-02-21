import { useState } from "react";
import { format } from "date-fns";
import type { ForwardedQuery } from "../../hooks/useOfficerQueries";
import { useAnswerQuery } from "../../hooks/useOfficerQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface QueryDetailProps {
  query: ForwardedQuery;
}

export function QueryDetail({ query }: QueryDetailProps) {
  const [answer, setAnswer] = useState(query.answer || "");
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
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">
              {query.forwardedBy?.name || query.userContext?.userName || "Unknown Farmer"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {query.forwardedBy?.address || query.userContext?.location || "No location provided"}
            </p>
            {query.forwardedBy?.email && (
              <p className="text-sm text-muted-foreground">
                {query.forwardedBy.email}
              </p>
            )}
            {query.forwardedBy?.phone && (
              <p className="text-sm text-muted-foreground">
                {query.forwardedBy.phone}
              </p>
            )}
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
                {query.relevantMessages.map((msg, index) => (
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
            <p className="text-sm text-green-900 dark:text-green-100 whitespace-pre-wrap">{query.answer}</p>
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
