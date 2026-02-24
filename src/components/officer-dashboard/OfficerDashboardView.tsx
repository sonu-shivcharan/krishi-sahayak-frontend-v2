import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { ForwardedQuery } from "../../hooks/useOfficerQueries";
import { useOfficerQueries } from "../../hooks/useOfficerQueries";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryDetail } from "./QueryDetail";
import { SchemeUploadDialog } from "./SchemeUploadDialog";


export function OfficerDashboardView() {
  const { data: queries, isLoading, isError } = useOfficerQueries();
  const [selectedQuery, setSelectedQuery] = useState<ForwardedQuery | null>(
    null,
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:flex-row">
        {/* Query List Skeleton */}
        <div className="flex w-full flex-col gap-4 md:w-1/3">
          <Skeleton className="h-7 w-40" />
          <div className="rounded-xl border bg-card p-4">
            <div className="flex flex-col gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-lg border p-3"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Query Detail Skeleton */}
        <div className="flex w-full flex-col gap-4 md:flex-1">
          <Skeleton className="h-7 w-32" />
          <div className="flex-1 rounded-xl border bg-card p-6">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-destructive">
          Failed to load queries. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:flex-row mt-4">
      {/* Query List Panel */}
      <div className="flex w-full flex-col gap-4 md:w-1/3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Incoming Queries
          </h2>
          <SchemeUploadDialog />
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)] flex-1 rounded-xl border bg-card text-card-foreground">
          <div className="flex flex-col gap-2 p-4">
            {queries?.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground p-4">
                No queries assigned to you yet.
              </p>
            ) : (
              queries?.map((query) => (
                <button
                  key={query._id}
                  onClick={() => setSelectedQuery(query)}
                  className={`flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent ${
                    selectedQuery?._id === query._id
                      ? "bg-accent border-primary/50"
                      : ""
                  }`}
                >
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate pr-2">
                        {query.userContext?.userName || "Anonymous Farmer"}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(query.forwardedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {query.userContext?.location || "Unknown Location"}
                    </span>
                  </div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">
                    {query.originalQuery}
                  </div>
                  <div className="flex items-center justify-between w-full mt-1">
                    <Badge
                      variant={
                        query.status === "answered" ? "default" : "secondary"
                      }
                    >
                      {query.status}
                    </Badge>
                    {query.summary && (
                      <span className="text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded-full">
                        Summary
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Query Detail Panel */}
      <div className="flex w-full flex-col gap-4 md:flex-1">
        <h2 className="text-xl font-semibold tracking-tight">Query Details</h2>
        <div className="flex-1 rounded-xl border bg-card text-card-foreground overflow-hidden">
          {selectedQuery ? (
            <QueryDetail query={selectedQuery} />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
              Select a query from the list to view details and provide an
              answer.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
