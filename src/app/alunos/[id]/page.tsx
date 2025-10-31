"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { getPlanTypeColor } from "@/lib/utils";
import { PlanType, Student, StudentReport } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function StudentDetailsPage() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [report, setReport] = useState<StudentReport | null>(null);
  const [planOptions, setPlanOptions] = useState<PlanType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState<string>("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, r, plans] = await Promise.all([
          api.getStudent(`${id}`),
          api.getStudentReport(`${id}`),
          api.getPlanTypes(),
        ]);
        setStudent(s);
        setReport(r);
        setPlanOptions(plans);
        setName(s.name);
        setEmail(s.email ?? "");
        setPhone(s.phone ?? "");
        setIsActive(s.isActive);
        setPlan(
          plans.find((p) => p.name === s.planTypeName)?.id.toString() || ""
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!student) return;
    setSubmitting(true);
    try {
      await api.updateStudent(student.id, {
        name,
        email,
        phone,
        planTypeId: plan,
        isActive,
      });
      setEditing(false);
      setStudent({
        ...student,
        name,
        email,
        phone,
        planTypeName: planOptions.find((p) => p.id.toString() === plan)?.name,
      } as Student);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!student) return <div className="p-6">Aluno não encontrado.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {editing ? "Editar Aluno" : student.name}
        </h1>
        {!editing ? (
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={getPlanTypeColor(student.planTypeName)}
            >
              {student.planTypeName}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
            >
              Editar
            </Button>
          </div>
        ) : null}
      </div>

      {editing ? (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Dados do aluno</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plano</Label>
                  <Select value={plan} onValueChange={setPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                    <SelectContent>
                      {planOptions.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ativo</Label>
                  <Select
                    value={isActive.toString()}
                    onValueChange={(v) => setIsActive(v === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um valor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="true" value="true">
                        Sim
                      </SelectItem>
                      <SelectItem key="false" value="false">
                        Não
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting || !name || !plan}>
                  {submitting ? "Salvando..." : "Salvar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Mês</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">Aulas realizadas</p>
                <p>{report?.totalClassesThisMonth ?? 0} aulas</p>
              </div>
              <div>
                <p className="font-medium">Último relatório</p>
                <p>
                  {report
                    ? new Date(report.reportDate).toLocaleDateString("pt-BR")
                    : "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferências de Aulas</CardTitle>
            </CardHeader>
            <CardContent>
              {report?.mostFrequentClassTypes?.length ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={report.mostFrequentClassTypes as any[]}
                          dataKey="percentage"
                          nameKey="classTypeName"
                          outerRadius={80}
                          label={({ name, percent }: any) =>
                            `${name} ${(
                              (typeof percent === "number"
                                ? percent
                                : Number(percent) || 0) * 100
                            ).toFixed(0)}%`
                          }
                        >
                          {report.mostFrequentClassTypes.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    {report.mostFrequentClassTypes.map((type) => (
                      <div key={type.classTypeId}>
                        <div className="flex justify-between text-sm font-medium">
                          <span>{type.classTypeName}</span>
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
                </div>
              ) : (
                <p className="text-sm text-gray-600">Sem dados ainda.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
