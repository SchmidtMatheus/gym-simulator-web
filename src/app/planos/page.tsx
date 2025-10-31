"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { PlanType } from "@/types";

export default function PlansPage() {
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [classLimit, setClassLimit] = useState(0);
  const [editingId, setEditingId] = useState<string>("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editClassLimit, setEditClassLimit] = useState(0);

  
  useEffect(() => {
    loadPlanTypes();
  }, []);

  async function loadPlanTypes() {
    setLoading(true);
    const data = await api.getPlanTypes();
    setPlans(data);
    setLoading(false);
  }

  interface NewPlanType {
    name: string;
    description?: string;
    classLimit: number;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const payload: NewPlanType = { name: name, description: description, classLimit: 0 };
    await api.createPlanType(payload);
    setName(""); setDescription(""); setClassLimit(0);
    loadPlanTypes();
  }

  async function handleDelete(id: string) {
    await api.deletePlanType(id);
    loadPlanTypes();
  }

  async function handleEdit(id: string) {
    setEditingId(id);
    const plan = plans.find(p => p.id === id);
    setEditName(plan?.name ?? "");
    setEditDescription(plan?.description || "");
    setEditClassLimit(plan?.classLimit || 0);
  }

  async function saveEdition(id: string) {
    await api.updatePlanType(id, { name: editName, description: editDescription, classLimit: editClassLimit });
    setEditingId("");
    loadPlanTypes();
  }

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planos</h1>
          <p className="text-gray-600">Gerencie os tipos de plano ofertados</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input placeholder="Nome do plano" value={name} onChange={e=>setName(e.target.value)} required />
        <Input placeholder="Descrição" value={description} onChange={e=>setDescription(e.target.value)} />
        <Input placeholder="Limite de aulas" value={classLimit} type="number" onChange={e=>setClassLimit(parseInt(e.target.value))} />
        <Button type="submit">Adicionar Plano</Button>
      </form>
      <div className="grid gap-6">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {editingId === plan.id ? (
                  <>
                    <Input value={editName} onChange={e=>setEditName(e.target.value)} className="w-36" />
                    <Input value={editDescription} onChange={e=>setEditDescription(e.target.value)} className="w-56" />
                    <Input value={editClassLimit} type="number" onChange={e=>setEditClassLimit(parseInt(e.target.value))} className="w-24" />
                    <Button size="sm" onClick={()=>saveEdition(plan.id)}>Salvar</Button>
                    <Button size="sm" variant="outline" onClick={()=>setEditingId("")}>Cancelar</Button>
                  </>
                ) : (
                  <>
                    <span>{plan.name}</span>
                    <span className="text-gray-500 text-xs">{plan.description}</span>
                    <span className="text-gray-500 text-xs">Limite de aulas: {plan.classLimit}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={()=>handleEdit(plan.id)}>Editar</Button>
                      <Button size="sm" variant="destructive" onClick={()=>handleDelete(plan.id)}>Excluir</Button>
                    </div>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
