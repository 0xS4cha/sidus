import { useMemo, useState } from "react";
import { getSatellitePosition } from "@/lib/getSatellitePosition";
import { SatelliteOMM } from "@/types/satellite";
import { StationOMM } from "@/types/station";
import SatelliteList from "@/assets/satellites.json";
import StationList from "@/assets/stations.json";

import {
  Map,
  MapPoints,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  type MapPointsDatum,
} from "@/components/ui/map";

interface GlobePoint extends MapPointsDatum {
  name: string;
}

export default function Home() {
  const satellites = useMemo<GlobePoint[]>(() => {
    const result: GlobePoint[] = [];
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

  const stations = useMemo<GlobePoint[]>(() => {
    const result: GlobePoint[] = [];
    for (const station of StationList as StationOMM[]) {
      const position = getSatellitePosition(station);
      if (position) {
        result.push({
          id: station.OBJECT_NAME,
          name: station.OBJECT_NAME,
          longitude: position.longitude,
          latitude: position.latitude,
        });
      }
    }
    return result;
  }, []);

  const [hovered, setHovered] = useState<GlobePoint | null>(null);

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
        <MapPoints
          data={stations}
          paint={{
            "circle-radius": 2,
            "circle-color": "#80f63b",
          }}
          hoverPaint={{
            "circle-radius": 4,
            "circle-color": "#a5fa60",
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