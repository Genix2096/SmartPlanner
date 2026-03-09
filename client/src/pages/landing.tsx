import { BookOpen, CheckCircle, Clock, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">SmartPlanner</span>
          </div>
          <div>
            <Button 
              onClick={() => window.location.href = "/login"}
              className="font-semibold px-6 rounded-full hover-elevate"
            >
              Log in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Elevate your academic performance
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold font-display tracking-tight text-foreground">
            Master your studies with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
              intelligent planning
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Stop stressing over scattered deadlines. SmartPlanner organizes your assignments, 
            tracks your progress, and helps you focus on what actually matters.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              onClick={() => window.location.href = "/login"}
              className="w-full sm:w-auto text-base h-14 px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started for Free
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          {[
            {
              icon: <CheckCircle className="h-6 w-6 text-emerald-500" />,
              title: "Task Management",
              desc: "Organize assignments by subject, priority, and deadline in one clean view."
            },
            {
              icon: <Clock className="h-6 w-6 text-amber-500" />,
              title: "Deadline Tracking",
              desc: "Never miss a due date with our integrated calendar and urgent task highlighting."
            },
            {
              icon: <LineChart className="h-6 w-6 text-indigo-500" />,
              title: "Progress Analytics",
              desc: "Visualize your productivity and see where you're excelling or falling behind."
            }
          ].map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-display mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
