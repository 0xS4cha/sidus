import {
  type MapPointsDatum,
} from "@/components/ui/map";



export interface GlobePoint extends MapPointsDatum {
  company: string;
  type: string;
  name: string;
}
