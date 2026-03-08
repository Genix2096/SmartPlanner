import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasks } from "@/hooks/use-tasks";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: tasks, isLoading } = useTasks();

  const selectedDayTasks = tasks?.filter(t => 
    date && isSameDay(new Date(t.deadline), date)
  ) || [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Calendar</h1>
        <p className="text-muted-foreground mt-1">Plan your study schedule by date.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="rounded-2xl border-border/50 shadow-md lg:col-span-1 h-fit">
          <CardContent className="p-4 sm:p-6 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
              modifiers={{
                hasTask: (d) => !!tasks?.some(t => isSameDay(new Date(t.deadline), d)),
              }}
              modifiersStyles={{
                hasTask: { 
                  fontWeight: 'bold', 
                  textDecoration: 'underline',
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))'
                }
              }}
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold font-display">
            {date ? format(date, "EEEE, MMMM do") : "Select a date"}
          </h2>
          
          {isLoading ? (
            <div className="text-muted-foreground">Loading tasks...</div>
          ) : selectedDayTasks.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border/60 rounded-2xl bg-muted/10">
              <p className="text-muted-foreground font-medium">No tasks due on this date.</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Enjoy your free time!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDayTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`bg-card rounded-xl p-5 border shadow-sm transition-all duration-300 hover-elevate ${
                    task.status === "Completed" ? "opacity-60 bg-muted/50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold text-lg ${task.status === "Completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.title}
                    </h3>
                    <Badge variant={task.status === "Completed" ? "outline" : task.priority === "High" ? "destructive" : "secondary"}>
                      {task.status === "Completed" ? "Done" : `${task.priority} Priority`}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" /> {task.subject}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> Due {format(new Date(task.deadline), "h:mm a")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
