import { Satellite, type LucideIcon } from "lucide-react";
import { ObjData } from "@/types/satellite";
import data  from "@/assets/data.json";

export interface LayerConfig<T = any> {
  id: string;
  label: string;
  icon: LucideIcon;
  data: T[];
  defaultActive?: boolean;
}

export const layers: LayerConfig[] = [
  {
    id: "satellite",
    label: "Satellites",
    icon: Satellite,
    data: data as ObjData[],
    defaultActive: true,
  },
];