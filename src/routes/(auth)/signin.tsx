import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";
export const Route = createFileRoute("/(auth)/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SignIn signUpUrl="/signup" />
    </div>
  );
}
