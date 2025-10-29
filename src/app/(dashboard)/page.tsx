// app/(dashboard)/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Activity, AlertCircle, Calendar, Users } from "lucide-react";

async function getDashboardData() {
  const [students, classes] = await Promise.all([
    api.getStudents(),
    api.getClasses(),
    // api.getRecentBookings(),
  ]);

  const totalStudents = students.length;
  const totalClasses = classes.length;
  const activeClasses = classes.filter((c) => !c.isCancelled).length;
  const nearCapacityClasses = classes.filter(
    (c) => c.currentParticipants >= c.maxCapacity - 2 && !c.isCancelled
  ).length;

  return {
    totalStudents,
    totalClasses,
    activeClasses,
    nearCapacityClasses,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    {
      title: "Total de Alunos",
      value: data.totalStudents.toString(),
      icon: Users,
      description: "Alunos cadastrados",
    },
    {
      title: "Total de Aulas",
      value: data.totalClasses.toString(),
      icon: Calendar,
      description: "Aulas criadas",
    },
    {
      title: "Aulas Ativas",
      value: data.activeClasses.toString(),
      icon: Activity,
      description: "Aulas não canceladas",
    },
    {
      title: "Aulas Quase Lotadas",
      value: data.nearCapacityClasses.toString(),
      icon: AlertCircle,
      description: "Aulas com poucas vagas",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral da academia</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
