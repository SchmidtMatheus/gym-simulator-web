"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Activity, BadgePercent, Calendar, PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [activeClasses, setActiveClasses] = useState(0);

  useEffect(() => {
    (async () => {
      const [students, classes, avaliableClasses] = await Promise.all([
        api.getStudents(),
        api.getClasses(),
        api.getAvaliableClasses(),
      ]);
      setTotalStudents(students.totalCount);
      setTotalClasses(classes.totalCount);
      setActiveClasses(avaliableClasses.totalCount);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Academia • Início
            </h1>
            <p className="text-gray-600">
              Acesse rapidamente as principais áreas
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Badge variant="secondary" className="uppercase tracking-wide">
            Informativo
          </Badge>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Alunos
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Alunos cadastrados
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Aulas
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClasses}</div>
                <p className="text-xs text-muted-foreground">Aulas criadas</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Aulas Disponíveis
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeClasses}</div>
                <p className="text-xs text-muted-foreground">Não canceladas e com vagas</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-2">
          <Badge className="uppercase tracking-wide">Acesso rápido</Badge>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/alunos">
              <Card className="cursor-pointer h-full border border-transparent hover:border-purple-200 hover:shadow-lg transition-all bg-linear-to-b from-white to-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-50">
                      <Users className="h-4 w-4" />
                    </span>
                    Alunos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Gerencie cadastros e veja o uso do plano.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/aulas">
              <Card className="cursor-pointer h-full border border-transparent hover:border-purple-200 hover:shadow-lg transition-all bg-linear-to-b from-white to-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-50">
                      <Calendar className="h-4 w-4" />
                    </span>
                    Aulas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Crie novas aulas e acompanhe capacidade.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/aulas/agendar">
              <Card className="cursor-pointer h-full border border-transparent hover:border-purple-200 hover:shadow-lg transition-all bg-linear-to-b from-white to-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-50">
                      <PlusCircle className="h-4 w-4" />
                    </span>
                    Agendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Agende alunos respeitando o plano e a lotação.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/planos">
              <Card className="cursor-pointer h-full border border-transparent hover:border-purple-200 hover:shadow-lg transition-all bg-linear-to-b from-white to-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-50">
                      <BadgePercent className="h-4 w-4" />
                    </span>
                    Planos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Gerencie os tipos de planos oferecidos.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
