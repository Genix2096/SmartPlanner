import { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useTasks } from "@/hooks/use-tasks";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";

export default function CalendarPage() {

  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: tasks, isLoading } = useTasks();


  /*
  ------------------------------------------------
  Only count PENDING tasks per day
  ------------------------------------------------
  */
  const taskDensity = useMemo(() => {

    const map = new Map<string, number>();

    tasks
      ?.filter(t => t.status === "Pending")
      .forEach(task => {

        const key = format(new Date(task.deadline), "yyyy-MM-dd");

        map.set(key, (map.get(key) || 0) + 1);

      });

    return map;

  }, [tasks]);


  /*
  ------------------------------------------------
  Get highlight intensity based on task count
  ------------------------------------------------
  */
  const getStyle = (d: Date) => {

    const key = format(d, "yyyy-MM-dd");
    const count = taskDensity.get(key) || 0;

    if (count >= 4) {
      return {
        backgroundColor: "#1e3a8a",
        color: "white",
        fontWeight: "bold"
      };
    }

    if (count === 3) {
      return {
        backgroundColor: "#1e40af",
        color: "white",
        fontWeight: "bold"
      };
    }

    if (count === 2) {
      return {
        backgroundColor: "#3b82f6",
        color: "white"
      };
    }

    if (count === 1) {
      return {
        backgroundColor: "#93c5fd",
        color: "black"
      };
    }

    return {};
  };


  /*
  ------------------------------------------------
  Tasks shown when a day is selected
  ------------------------------------------------
  */
  const selectedDayTasks =
    tasks?.filter(
      t => date && isSameDay(new Date(t.deadline), date)
    ) || [];


  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">
          Calendar
        </h1>
        <p className="text-muted-foreground mt-1">
          Plan your study schedule by date.
        </p>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Calendar */}
        <Card className="rounded-2xl border-border/50 shadow-md lg:col-span-1 h-fit">

          <CardContent className="p-4 sm:p-6 flex justify-center">

            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"

              modifiers={{
                hasTask: (d) => {
                  const key = format(d, "yyyy-MM-dd");
                  return (taskDensity.get(key) || 0) > 0;
                },
              }}

              modifiersStyles={{
                hasTask: {
                textDecoration: "underline",
                textDecorationThickness: "3px",
                textUnderlineOffset: "4px",
                textDecorationColor: "hsl(var(--primary))",
                fontWeight: "600"
              }
              }}
            />

          </CardContent>

        </Card>


        {/* Tasks for selected day */}
        <div className="lg:col-span-2 space-y-4">

          <h2 className="text-xl font-bold font-display">
            {date ? format(date, "EEEE, MMMM do") : "Select a date"}
          </h2>

          {isLoading ? (
            <div className="text-muted-foreground">
              Loading tasks...
            </div>

          ) : selectedDayTasks.length === 0 ? (

            <div className="p-12 text-center border border-dashed border-border/60 rounded-2xl bg-muted/10">
              <p className="text-muted-foreground font-medium">
                No tasks due on this date.
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Enjoy your free time!
              </p>
            </div>

          ) : (

            <div className="space-y-4">

              {selectedDayTasks.map(task => (

                <div
                  key={task.id}
                  className={`bg-card rounded-xl p-5 border shadow-sm transition-all duration-300 hover-elevate ${
                    task.status === "Completed"
                      ? "opacity-60 bg-muted/50"
                      : ""
                  }`}
                >

                  <div className="flex justify-between items-start mb-2">

                    <h3
                      className={`font-semibold text-lg ${
                        task.status === "Completed"
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </h3>

                    <Badge
                      variant={
                        task.status === "Completed"
                          ? "outline"
                          : task.priority === "High"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {task.status === "Completed"
                        ? "Done"
                        : `${task.priority} Priority`}
                    </Badge>

                  </div>


                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">

                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      {task.subject}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Due {format(new Date(task.deadline), "h:mm a")}
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