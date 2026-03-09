import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";

import { AppSidebar } from "@/components/app-sidebar";

import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import DashboardPage from "@/pages/dashboard";
import TasksPage from "@/pages/tasks";
import CalendarPage from "@/pages/calendar";
import ProgressPage from "@/pages/progress";
import Login from "@/pages/Login";


// Layout wrapper for app pages
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


// Router for the whole app
function Router() {
  return (
    <Switch>

      {/* Public pages */}
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={Login} />

      {/* App pages */}
      <Route path="/dashboard">
        <AuthenticatedLayout>
          <DashboardPage />
        </AuthenticatedLayout>
      </Route>

      <Route path="/tasks">
        <AuthenticatedLayout>
          <TasksPage />
        </AuthenticatedLayout>
      </Route>

      <Route path="/calendar">
        <AuthenticatedLayout>
          <CalendarPage />
        </AuthenticatedLayout>
      </Route>

      <Route path="/progress">
        <AuthenticatedLayout>
          <ProgressPage />
        </AuthenticatedLayout>
      </Route>

      {/* fallback */}
      <Route component={NotFound} />

    </Switch>
  );
}


// Main App wrapper
function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

        <TooltipProvider>

          <Router />

          <Toaster />

        </TooltipProvider>

      </ThemeProvider>

    </QueryClientProvider>
  );
}

export default App;