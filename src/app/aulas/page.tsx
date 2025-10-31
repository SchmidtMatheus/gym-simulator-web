"use client";

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
import { ClassType as AppClassType, Class } from "@/types";
import { Calendar, PlusCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [classTypes, setClassTypes] = useState<AppClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [classTypeId, setClassTypeId] = useState<string>("");
  const [dateTime, setDateTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [capacity, setCapacity] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
    loadClassTypes();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.getClasses();
      setClasses(data.items);
    } finally {
      setLoading(false);
    }
  }

  async function loadClassTypes() {
    const types = await api.getClassTypes();
    setClassTypes(types);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!classTypeId || !dateTime) return;
    setSubmitting(true);
    try {
      await api.createClass({
        classTypeId: classTypeId,
        scheduledAt: dateTime,
        durationMinutes: duration,
        maxCapacity: capacity,
        isActive: true,
      });
      setClassTypeId("");
      setDateTime("");
      setDuration(60);
      setCapacity(10);
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aulas</h1>
          <p className="text-gray-600">Gerencie as aulas da academia</p>
        </div>
        <Button asChild>
          <a href="/aulas/agendar">
            <PlusCircle className="h-4 w-4 mr-2" /> Agendar
          </a>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Criar nova aula</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo da aula</Label>
                <Select value={classTypeId} onValueChange={setClassTypeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o tipo de aula" />
                  </SelectTrigger>
                  <SelectContent>
                    {classTypes.map((type) => (
                      <SelectItem value={type.id.toString()} key={type.id}>
                        {type?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data e hora</Label>
                <Input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duração (min)</Label>
                  <Input
                    type="number"
                    min={15}
                    step={5}
                    value={duration}
                    onChange={(e) =>
                      setDuration(parseInt(e.target.value || "0"))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Capacidade</Label>
                  <Input
                    type="number"
                    min={1}
                    value={capacity}
                    onChange={(e) =>
                      setCapacity(parseInt(e.target.value || "0"))
                    }
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={submitting || !classTypeId || !dateTime}
              >
                {submitting ? "Criando..." : "Criar Aula"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas aulas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {c.classTypeName ?? "N/A"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(c.scheduledAt).toLocaleString("pt-BR")}
                    </p>
                    <p className="text-xs text-gray-500">
                      Duração: {c.durationMinutes}min
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>
                        {c.currentParticipants}/{c.maxCapacity}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {c.isCancelled ? "Cancelada" : "Ativa"}
                    </span>
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
