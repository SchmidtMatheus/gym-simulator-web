"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { Student, StudentReport } from "@/types";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [report, setReport] = useState<StudentReport | null>(null);

  useEffect(() => {
    api.getStudents().then(response => setStudents(response.items));
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.getStudentReport(selected).then(setReport);
  }, [selected]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Resumo mensal por aluno</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecione um aluno</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-sm">
            <Label>Aluno</Label>
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um aluno" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {report && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">Plano</p>
                <p>{report.planType}</p>
              </div>
              <div>
                <p className="font-medium">Limite Mensal</p>
                <p>{report.monthlyClassLimit} aulas</p>
              </div>
              <div>
                <p className="font-medium">Agendadas</p>
                <p>{report.currentMonthClasses} aulas</p>
              </div>
              <div>
                <p className="font-medium">Restantes</p>
                <p>{report.remainingClasses} aulas</p>
              </div>
              <div className="sm:col-span-3">
                <p className="font-medium">Tipos favoritos</p>
                <p className="text-gray-600 text-sm">{report.topClassTypes.join(', ') || 'Sem dados'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


