"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PLAN_OPTIONS = [
  { id: 1, name: 'Mensal' },
  { id: 2, name: 'Trimestral' },
  { id: 3, name: 'Anual' },
];

export default function NewStudentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !plan) return;
    setSubmitting(true);
    try {
      await api.createStudent({
        name,
        planTypeId: parseInt(plan),
        // @ts-ignore
        email,
        // @ts-ignore
        phone,
      } as any);
      router.push('/alunos');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Novo Aluno</h1>
        <p className="text-gray-600">Cadastre um novo aluno e defina o plano</p>
      </div>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Dados do aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Plano</Label>
              <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_OPTIONS.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={submitting || !name || !plan}>
              {submitting ? 'Salvando...' : 'Salvar' }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


