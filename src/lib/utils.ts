import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPlanTypeColor = (planType: string) => {
  switch (planType) {
    case "Plano Anual":
      return "bg-green-100 text-green-800";
    case "Plano Trimestral":
      return "bg-blue-100 text-blue-800";
    case "Plano Mensal":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
