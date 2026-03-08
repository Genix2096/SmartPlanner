import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import DashboardPage from "@/pages/dashboard";
import TasksPage from "@/pages/tasks";
import CalendarPage from "@/pages/calendar";
import ProgressPage from "@/pages/progress";

// Layout wrapper for authenticated users
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex h-16 items-center border-b border-border/50 px-4 md:hidden bg-background/80 backdrop-blur-md sticky top-0 z-40">
            <SidebarTrigger className="text-foreground shrink-0" />
            <span className="font-bold font-display ml-4">SmartPlanner</span>
          </header>
          <main className="flex-1 overflow-auto pb-10">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center text-primary">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <p className="font-medium animate-pulse">Loading your planner...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated users only see the landing page
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route>
          {/* Redirect everything else to landing if not auth'd */}
          <LandingPage />
        </Route>
      </Switch>
    );
  }

  // Authenticated routes
  return (
    <AuthenticatedLayout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/tasks" component={TasksPage} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/progress" component={ProgressPage} />
        <Route component={NotFound} />
      </Switch>
    </AuthenticatedLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
