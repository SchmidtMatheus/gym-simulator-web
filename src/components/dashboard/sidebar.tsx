// components/dashboard/sidebar.tsx
"use client";

import { cn } from "@/lib/utils";
import { BarChart3, Calendar, Home, Users, Layers, BadgePercent } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Alunos", href: "/alunos", icon: Users },
  { name: "Aulas", href: "/aulas", icon: Calendar },
  { name: "Planos", href: "/planos", icon: BadgePercent },
  { name: "Tipos de Aula", href: "/tipos-aula", icon: Layers },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 hidden lg:block sticky top-0 h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Academia</h1>
      </div>
      <nav className="space-y-2 px-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-purple-100 text-purple-900"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
