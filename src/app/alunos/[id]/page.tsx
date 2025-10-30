"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Student, StudentReport } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentDetailsPage() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [report, setReport] = useState<StudentReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, r] = await Promise.all([api.getStudent(`${id}`),
        api.getStudentReport(`${id}`)]);
        setStudent(s);
        setReport(r);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!student) return <div className="p-6">Aluno não encontrado.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
        <Badge variant="secondary">{student.planTypeName}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo do Mês</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium">Limite Mensal</p>
            <p>{report?.monthlyClassLimit} aulas</p>
          </div>
          <div>
            <p className="font-medium">Agendadas</p>
            <p>{report?.currentMonthClasses} aulas</p>
          </div>
          <div>
            <p className="font-medium">Restantes</p>
            <p>{report?.remainingClasses} aulas</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências de Aulas</CardTitle>
        </CardHeader>
        <CardContent>
          {report?.topClassTypes?.length ? (
            <div className="flex gap-2 flex-wrap">
              {report.topClassTypes.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">Sem dados ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


