import {
  type MapPointsDatum,
} from "@/components/ui/map";



export interface GlobePoint extends MapPointsDatum {
  type: string;
  name: string;
  altitude: number;
}
