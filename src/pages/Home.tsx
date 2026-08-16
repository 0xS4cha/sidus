import { useMemo, useState } from "react";
import { getSatellitePosition } from "@/lib/getSatellitePosition";
import { SatelliteOMM } from "@/types/satellite";
import SatelliteList from "@/assets/satellite.json";
import {
  Map,
  MapPoints,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  type MapPointsDatum,
} from "@/components/ui/map";

interface SatellitePoint extends MapPointsDatum {
  name: string;
}

export default function Home() {
  const satellites = useMemo<SatellitePoint[]>(() => {
    const result: SatellitePoint[] = [];
    for (const satellite of SatelliteList as SatelliteOMM[]) {
      const position = getSatellitePosition(satellite);
      if (position) {
        result.push({
          id: satellite.OBJECT_NAME,
          name: satellite.OBJECT_NAME,
          longitude: position.longitude,
          latitude: position.latitude,
        });
      }
    }
    return result;
  }, []);

  const [hovered, setHovered] = useState<SatellitePoint | null>(null);

  return (
    <div className="absolute h-full w-full">
      <Map zoom={1} projection={{ type: "globe" }}>
        <MapPoints
          data={satellites}
          paint={{
            "circle-radius": 2,
            "circle-color": "#3b82f6",
          }}
          hoverPaint={{
            "circle-radius": 4,
            "circle-color": "#60a5fa",
          }}
          onHover={(e) => setHovered(e?.point ?? null)}
        />

        {hovered && (
          <MapMarker longitude={hovered.longitude} latitude={hovered.latitude}>
            <MarkerContent className="pointer-events-none">
              <div className="size-2 rounded-full border-2 border-white bg-blue-400" />
              <MarkerLabel position="top">{hovered.name}</MarkerLabel>
            </MarkerContent>
          </MapMarker>
        )}
      </Map>
    </div>
  );
}