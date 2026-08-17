import { Satellite, RadioTower, type LucideIcon } from "lucide-react";
import SatelliteList from "@/assets/satellites.json";
import StationList from "@/assets/stations.json";
import { SatelliteOMM } from "@/types/satellite";
import { StationOMM } from "@/types/station";

export interface LayerConfig<T = any> {
  id: string;
  label: string;
  icon: LucideIcon;
  data: T[];
  getCompany?: (obj: T) => string;
  defaultActive?: boolean;
}

export const layers: LayerConfig[] = [
  {
    id: "satellite",
    label: "Satellites",
    icon: Satellite,
    data: SatelliteList as SatelliteOMM[],
    getCompany: (obj) => (obj.OBJECT_NAME.includes("STARLINK") ? "Starlink" : "Unknow"),
    defaultActive: true,
  },
  {
    id: "station",
    label: "Stations",
    icon: RadioTower,
    data: StationList as StationOMM[],
    getCompany: () => "Unknow",
    defaultActive: true,
  },
];