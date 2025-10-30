// app/aulas/agendar/page.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { Class, Student } from "@/types";
import { Calendar, CheckCircle, Users, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function SchedulePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [students, classes] = await Promise.all([
        api.getStudents(),
        api.getAvaliableClasses(),
      ]);
      setStudents(students.items);
      setClasses(classes.items);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedClass) return;

    setSubmitting(true);
    setResult(null);

    try {
      const result = await api.createBooking({
        studentId: selectedStudent,
        classId: selectedClass,
      });

      setResult({
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        setSelectedStudent("");
        setSelectedClass("");
        loadData();
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Erro ao realizar agendamento",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getCapacityColor = (classItem: Class) => {
    const percentage =
      (classItem.currentParticipants / classItem.maxCapacity) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-orange-600";
    return "text-green-600";
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agendar Aula</h1>
        <p className="text-gray-600">Agende aulas para os alunos</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Novo Agendamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student">Aluno</Label>
                <Select
                  value={selectedStudent}
                  onValueChange={setSelectedStudent}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem
                        key={student.id}
                        value={student.id.toString()}
                      >
                        {student.name} - {student.planTypeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Aula</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma aula" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem
                        key={classItem.id}
                        value={classItem.id.toString()}
                      >
                        <div className="flex justify-between w-full">
                          <span>
                            {classItem.classTypeName} -{" "}
                            {new Date(classItem.scheduledAt).toLocaleString()}
                          </span>
                          <Badge
                            variant="secondary"
                            className={getCapacityColor(classItem)}
                          >
                            {classItem.currentParticipants}/
                            {classItem.maxCapacity}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={submitting || !selectedStudent || !selectedClass}
              >
                {submitting ? "Agendando..." : "Agendar Aula"}
              </Button>

              {result && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-md ${result.success
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
                >
                  {result.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span>{result.message}</span>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aulas Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {classItem.classTypeName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(classItem.scheduledAt).toLocaleString("pt-BR")}
                    </p>
                    <p className="text-xs text-gray-500">
                      Duração: {classItem.durationMinutes} min
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className={getCapacityColor(classItem)}>
                        {classItem.currentParticipants}/{classItem.maxCapacity}
                      </span>
                    </div>
                    <Badge
                      variant={
                        classItem.currentParticipants >= classItem.maxCapacity
                          ? "destructive"
                          : classItem.maxCapacity -
                            classItem.currentParticipants <=
                            2
                            ? "secondary"
                            : "default"
                      }
                    >
                      {classItem.currentParticipants >= classItem.maxCapacity
                        ? "Lotada"
                        : classItem.maxCapacity -
                          classItem.currentParticipants <=
                          2
                          ? "Quase Lotada"
                          : "Com Vagas"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
