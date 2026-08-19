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
        id: obj.name,
        name: obj.name,
        longitude: position.longitude,
        latitude: position.latitude,
        altitude: position.altitude
      });
    }
  }
  return result;
}