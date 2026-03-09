import { useState } from "react";
import { format } from "date-fns";
import { Plus, MoreHorizontal, CheckCircle2, Circle, Pencil, Trash2, BookOpen, Clock } from "lucide-react";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { TaskDialog } from "@/components/task-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TasksPage() {
  const [filter, setFilter] = useState<"All" | "Pending" | "Completed">("All");
  const { data: tasks, isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filteredTasks = tasks?.filter(t =>
    filter === "All" ? true : t.status === filter
  ) || [];

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedTask(null);
    setDialogOpen(true);
  };

  const handleToggleStatus = (task: Task) => {

  // If already completed → do nothing
  if (task.status === "Completed") {
    return;
  }

  // Only allow Pending → Completed
  updateTask.mutate({
    id: task.id,
    status: "Completed"
  });

};

  if (isLoading) {
    return <div className="p-8 text-white">Loading tasks...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">
            Task Manager
          </h1>
          <p className="text-white mt-1">
            Manage and track your academic assignments.
          </p>
        </div>

        <Button onClick={handleCreate} className="rounded-xl shadow-md hover-elevate">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="All" className="rounded-lg">All Tasks</TabsTrigger>
            <TabsTrigger value="Pending" className="rounded-lg">Pending</TabsTrigger>
            <TabsTrigger value="Completed" className="rounded-lg">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-border/60 rounded-2xl bg-muted/20">
            <CheckSquareIcon className="h-12 w-12 mx-auto text-white mb-3" />
            <h3 className="text-lg font-medium text-white">No tasks found</h3>
            <p className="text-white">
              You don't have any {filter !== "All" ? filter.toLowerCase() : ""} tasks right now.
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`bg-card rounded-2xl p-5 border shadow-sm transition-all duration-300 hover:shadow-md ${
                task.status === "Completed"
                  ? "opacity-70 border-border/50 bg-muted/30"
                  : "border-border/80"
              }`}
            >

              {/* Title */}
              <div className="flex items-start justify-between mb-3">

                <div
                  className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => {
                    if (task.status !== "Completed") {
                      handleToggleStatus(task);
                    }}}>

                  <div className="mt-0.5">
                    {task.status === "Completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 transition-transform group-hover:scale-110" />
                    ) : (
                      <Circle className="h-5 w-5 text-black transition-transform group-hover:scale-110" />
                    )}
                  </div>

                  <div>
                    <h3 className={`font-semibold text-lg leading-tight ${
                      task.status === "Completed"
                        ? "line-through text-gray-500"
                        : "text-black"
                    }`}>
                      {task.title}
                    </h3>
                  </div>

                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-black">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem onClick={() => handleEdit(task)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => setDeleteId(task.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>

              {/* Description */}
              {task.description && (
                <p className="text-sm text-black line-clamp-2 mb-4 ml-8">
                  {task.description}
                </p>
              )}

              {/* Tags */}
              <div className="ml-8 mt-4 flex flex-wrap items-center gap-2">

                <Badge className="rounded-md font-normal text-xs bg-primary/5 text-primary border-none">
                  <BookOpen className="mr-1.5 h-3 w-3" />
                  {task.subject}
                </Badge>

                <Badge variant="outline" className="rounded-md font-normal text-xs text-black">
                  <Clock className="mr-1.5 h-3 w-3" />
                  {format(new Date(task.deadline), "MMM d")}
                </Badge>

                {task.priority === "High" && (
                  <Badge variant="destructive" className="rounded-md font-medium text-xs">
                    High Priority
                  </Badge>
                )}

              </div>

            </div>
          ))
        )}
      </div>

      {/* Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this task.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (deleteId) deleteTask.mutate(deleteId);
                setDeleteId(null);
              }}
              className="rounded-xl bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

function CheckSquareIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}