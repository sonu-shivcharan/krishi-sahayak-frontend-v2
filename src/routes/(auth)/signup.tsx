import { SignUp } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";
import { Sprout } from "lucide-react";

export const Route = createFileRoute("/(auth)/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container relative h-full flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Sprout className="mr-2 h-6 w-6" />
          Krishi Sahayak
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Joining Krishi Sahayak was the best decision for my farm. The community and tools are unmatched.&rdquo;
            </p>
            <footer className="text-sm">Priya Singh</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <div className="flex justify-center">
            <SignUp forceRedirectUrl={"/onboard"} signInUrl="/signin" />
          </div>
        </div>
      </div>
    </div>
  );
}
