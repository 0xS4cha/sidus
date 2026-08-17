import { getSatellitePosition } from "@/lib/getSatellitePosition"
import { GlobePoint } from "@/types/points";
import { layers } from "@/lib/layers"

export function computePositions(now: Date, activeLayers: Set<string>): GlobePoint[] {
  const result: GlobePoint[] = [];
  for (const layer of layers) {
    if (!activeLayers.has(layer.id)) continue;
    for (const obj of layer.data) {
      const position = getSatellitePosition(obj, now);
      if (!position) continue;
      result.push({
        type: layer.id,
        company: layer.getCompany?.(obj) ?? "Unknow",
        id: obj.OBJECT_NAME,
        name: obj.OBJECT_ID,
        longitude: position.longitude,
        latitude: position.latitude,
      });
    }
  }
  return result;
}