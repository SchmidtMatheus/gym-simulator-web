"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { ClassType } from "@/types";

export default function TiposAulaPage() {
  const [tipos, setTipos] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  
  useEffect(() => {
    carregarTipos();
  }, []);

  async function carregarTipos() {
    setLoading(true);
    const data = await api.getClassTypes();
    setTipos(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await api.createClassType({ name: nome, description: descricao });
    setNome(""); setDescricao("");
    carregarTipos();
  }

  async function handleDelete(id: number) {
    await api.deleteClassType(id);
    carregarTipos();
  }

  function handleEdit(id: number) {
    setEditandoId(id);
    const tipo = tipos.find(t => t.id === id);
    setEditNome(tipo?.name || "");
    setEditDescricao(tipo?.description || "");
  }

  async function salvarEdicao(id: number) {
    await api.updateClassType(id, { name: editNome, description: editDescricao });
    setEditandoId(null);
    carregarTipos();
  }

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tipos de Aula</h1>
          <p className="text-gray-600">Gerencie os tipos de aula oferecidos</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input placeholder="Nome do tipo de aula" value={nome} onChange={e=>setNome(e.target.value)} required />
        <Input placeholder="Descrição" value={descricao} onChange={e=>setDescricao(e.target.value)} />
        <Button type="submit">Adicionar Tipo</Button>
      </form>
      <div className="grid gap-6">
        {tipos.map((tipo) => (
          <Card key={tipo.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {editandoId === tipo.id ? (
                  <>
                    <Input value={editNome} onChange={e=>setEditNome(e.target.value)} className="w-36" />
                    <Input value={editDescricao} onChange={e=>setEditDescricao(e.target.value)} className="w-56" />
                    <Button size="sm" onClick={()=>salvarEdicao(tipo.id)}>Salvar</Button>
                    <Button size="sm" variant="outline" onClick={()=>setEditandoId(null)}>Cancelar</Button>
                  </>
                ) : (
                  <>
                    <span>{tipo.name}</span>
                    <span className="text-gray-500 text-xs">{tipo.description}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={()=>handleEdit(tipo.id)}>Editar</Button>
                      <Button size="sm" variant="destructive" onClick={()=>handleDelete(tipo.id)}>Excluir</Button>
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
