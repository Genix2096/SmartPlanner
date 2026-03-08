import { useMemo } from "react";
import { Link } from "wouter";
import { format, isToday, isTomorrow, isPast, isThisWeek } from "date-fns";
import { BookOpen, CheckCircle2, Clock, AlertCircle, Plus, ArrowRight } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { data: tasks, isLoading } = useTasks();

  const stats = useMemo(() => {
    if (!tasks) return { total: 0, completed: 0, pending: 0, urgent: 0, percentage: 0 };
    
    const completed = tasks.filter(t => t.status === "Completed").length;
    const pending = tasks.length - completed;
    const urgent = tasks.filter(t => t.status === "Pending" && t.priority === "High").length;
    
    return {
      total: tasks.length,
      completed,
      pending,
      urgent,
      percentage: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
    };
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks
      .filter(t => t.status === "Pending")
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-10 w-48 bg-muted animate-pulse rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Here's your study overview for today.</p>
        </div>
        <Button asChild className="rounded-xl shadow-md hover-elevate">
          <Link href="/tasks">
            <Plus className="mr-2 h-4 w-4" /> Add New Task
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-none shadow-md bg-gradient-to-br from-indigo-500 to-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Progress</CardTitle>
            <BookOpen className="h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{stats.percentage}%</div>
            <Progress value={stats.percentage} className="h-2 mt-3 bg-primary-foreground/20" />
            <p className="text-xs opacity-80 mt-3">{stats.completed} of {stats.total} tasks completed</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">To be completed</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">Done and dusted</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground mt-1">High priority tasks</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Upcoming Deadlines</h2>
            <Button variant="ghost" size="sm" asChild className="text-primary">
              <Link href="/tasks">View all <ArrowRight className="ml-1 h-4 w-4"/></Link>
            </Button>
          </div>
          
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
            {upcomingTasks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500/50 mb-3" />
                <p className="font-medium">You're all caught up!</p>
                <p className="text-sm">No pending tasks found.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {upcomingTasks.map(task => {
                  const deadline = new Date(task.deadline);
                  const isOverdue = isPast(deadline) && !isToday(deadline);
                  const isUrgent = task.priority === "High" || isToday(deadline) || isTomorrow(deadline);
                  
                  return (
                    <div key={task.id} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-muted/30 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground line-clamp-1">{task.title}</h3>
                          {isUrgent && <Badge variant="destructive" className="px-1.5 py-0 text-[10px] uppercase tracking-wider">Urgent</Badge>}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> {task.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> 
                            <span className={isOverdue ? "text-destructive font-medium" : ""}>
                              {isToday(deadline) ? "Today" 
                                : isTomorrow(deadline) ? "Tomorrow" 
                                : format(deadline, "MMM d")}
                            </span>
                          </span>
                        </div>
                      </div>
                      <Badge variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "secondary" : "outline"} className="shrink-0 rounded-full">
                        {task.priority} Priority
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Study Tips / Motivation Card */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-display">Study Tip</h2>
          <Card className="rounded-2xl border border-border/50 shadow-sm bg-gradient-to-b from-indigo-50/50 to-background dark:from-indigo-950/20">
            <CardContent className="p-6 pt-6">
              <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl">💡</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Pomodoro Technique</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Break your study sessions into 25-minute intervals separated by short 5-minute breaks. It improves focus and prevents mental fatigue.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
