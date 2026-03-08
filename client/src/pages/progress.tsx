import { useMemo } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Award, Target, TrendingUp } from "lucide-react";

export default function ProgressPage() {
  const { data: tasks, isLoading } = useTasks();

  const chartData = useMemo(() => {
    if (!tasks) return { subjectData: [], statusData: [], total: 0, completed: 0 };
    
    // Group by Subject
    const subjectMap: Record<string, { pending: number, completed: number }> = {};
    
    tasks.forEach(t => {
      const subj = t.subject || "Other";
      if (!subjectMap[subj]) subjectMap[subj] = { pending: 0, completed: 0 };
      
      if (t.status === "Completed") subjectMap[subj].completed++;
      else subjectMap[subj].pending++;
    });

    const subjectData = Object.keys(subjectMap).map(name => ({
      name,
      Completed: subjectMap[name].completed,
      Pending: subjectMap[name].pending,
      total: subjectMap[name].completed + subjectMap[name].pending
    })).sort((a, b) => b.total - a.total).slice(0, 6); // top 6 subjects

    const completed = tasks.filter(t => t.status === "Completed").length;
    const pending = tasks.length - completed;

    const statusData = [
      { name: 'Completed', value: completed, color: 'hsl(142 71% 45%)' }, // emerald
      { name: 'Pending', value: pending, color: 'hsl(215 16% 47%)' }, // slate
    ];

    return { subjectData, statusData, total: tasks.length, completed };
  }, [tasks]);

  if (isLoading) {
    return <div className="p-8">Loading analytics...</div>;
  }

  const completeRate = chartData.total ? Math.round((chartData.completed / chartData.total) * 100) : 0;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="mb-4">
        <h1 className="text-3xl font-bold font-display text-foreground">Study Progress</h1>
        <p className="text-muted-foreground mt-1">Visualize your productivity and track your academic performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-2xl text-primary">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
              <h2 className="text-3xl font-bold font-display">{completeRate}%</h2>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-500">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tasks Finished</p>
              <h2 className="text-3xl font-bold font-display">{chartData.completed}</h2>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-amber-500/10 p-4 rounded-2xl text-amber-500">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Assignments</p>
              <h2 className="text-3xl font-bold font-display">{chartData.total}</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-2xl shadow-sm border-border/50 col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-display text-xl">Overall Status</CardTitle>
            <CardDescription>Your total task distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {chartData.total === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/50 col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-display text-xl">Tasks by Subject</CardTitle>
            <CardDescription>Workload distributed across your classes</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {chartData.subjectData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.subjectData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="Completed" stackId="a" fill="hsl(142 71% 45%)" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="Pending" stackId="a" fill="hsl(215 16% 47%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
