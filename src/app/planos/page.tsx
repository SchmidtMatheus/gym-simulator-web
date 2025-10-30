"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function PlanosPage() {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  
  useEffect(() => {
    carregarPlanos();
  }, []);

  async function carregarPlanos() {
    setLoading(true);
    const data = await api.getPlanTypes();
    setPlanos(data);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.createPlanType({ name: nome, description: descricao });
    setNome(""); setDescricao("");
    carregarPlanos();
  }

  async function handleDelete(id) {
    await api.deletePlanType(id);
    carregarPlanos();
  }

  async function handleEdit(id) {
    setEditandoId(id);
    const plano = planos.find(p => p.id === id);
    setEditNome(plano.name);
    setEditDescricao(plano.description || "");
  }

  async function salvarEdicao(id) {
    await api.updatePlanType(id, { name: editNome, description: editDescricao });
    setEditandoId(null);
    carregarPlanos();
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
        <Input placeholder="Nome do plano" value={nome} onChange={e=>setNome(e.target.value)} required />
        <Input placeholder="Descrição" value={descricao} onChange={e=>setDescricao(e.target.value)} />
        <Button type="submit">Adicionar Plano</Button>
      </form>
      <div className="grid gap-6">
        {planos.map((plano) => (
          <Card key={plano.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {editandoId === plano.id ? (
                  <>
                    <Input value={editNome} onChange={e=>setEditNome(e.target.value)} className="w-36" />
                    <Input value={editDescricao} onChange={e=>setEditDescricao(e.target.value)} className="w-56" />
                    <Button size="sm" onClick={()=>salvarEdicao(plano.id)}>Salvar</Button>
                    <Button size="sm" variant="outline" onClick={()=>setEditandoId(null)}>Cancelar</Button>
                  </>
                ) : (
                  <>
                    <span>{plano.name}</span>
                    <span className="text-gray-500 text-xs">{plano.description}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={()=>handleEdit(plano.id)}>Editar</Button>
                      <Button size="sm" variant="destructive" onClick={()=>handleDelete(plano.id)}>Excluir</Button>
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
