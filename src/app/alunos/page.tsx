// app/alunos/page.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { getPlanTypeColor } from "@/lib/utils";
import { Student, StudentReport } from "@/types";
import { BarChart3, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [reports, setReports] = useState<Map<string, StudentReport>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const studentsData = await api.getStudents();
      setStudents(studentsData.items);

      const reportsMap = new Map();
      for (const student of studentsData.items) {
        try {
          const report = await api.getStudentReport(student.id);
          reportsMap.set(student.id, report);
        } catch (error) {
          console.error(
            `Erro ao carregar relatório do aluno ${student.id}:`,
            error
          );
        }
      }
      setReports(reportsMap);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
          <p className="text-gray-600">Gerencie os alunos da academia</p>
        </div>
        <Button asChild>
          <Link href="/alunos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Aluno
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {students.map((student) => {
          const report = reports.get(student.id);
          return (
            <Card key={student.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {student.name}
                      <Badge
                        variant="secondary"
                        className={getPlanTypeColor(student.planTypeName)}
                      >
                        {student.planTypeName}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {student.email} • {student.phone}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/alunos/${student.id}`}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {report ? (
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Utilizadas</p>
                      <p>{report.totalClassesThisMonth} aulas</p>
                    </div>

                    <div className="col-span-3">
                      <p className="font-medium mb-2">Preferências</p>
                      {report.mostFrequentClassTypes.length > 0 ? (
                        <div className="space-y-2">
                          {report.mostFrequentClassTypes.map((type) => (
                            <div key={type.classTypeId}>
                              <div className="flex justify-between text-xs">
                                <span className="font-medium pb-0.5">
                                  {type.classTypeName}
                                </span>
                                <span>{type.percentage}%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${type.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">
                          Nenhuma aula registrada
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Relatório não disponível
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
