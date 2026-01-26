import OnboardForm from "@/components/OnboardForm";
import { useAuth } from "@clerk/clerk-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/onboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const auth = useAuth();
  if (!auth.isSignedIn && auth.isLoaded) {
    navigate({ to: "/signin" });
  }
  return <OnboardForm />;
}
