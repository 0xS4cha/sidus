import { useState, useEffect } from "react";
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
  MapPopup,
  type MapPointsDatum,
} from "@/components/ui/map";

const ObjTypes = {
  satellite: "satellite",
  station: "station",
} as const;

type ObjType = typeof ObjTypes[keyof typeof ObjTypes];

interface GlobePoint extends MapPointsDatum {
  type: ObjType;
  name: string;
}


const REFRESH_INTERVAL_MS = 500;

function computeSatellitePositions(now: Date): GlobePoint[] {
  const result: GlobePoint[] = [];
  for (const obj of SatelliteList as SatelliteOMM[]) {
    const position = getSatellitePosition(obj, now);
    if (position) {
      result.push({
        type: ObjTypes.satellite,
        id: obj.OBJECT_NAME,
        name: obj.OBJECT_ID,
        longitude: position.longitude,
        latitude: position.latitude,
      });
    }
  }

  for (const obj of StationList as StationOMM[]) {
    const position = getSatellitePosition(obj, now);
    if (position) {
      result.push({
        type: ObjTypes.station,
        id: obj.OBJECT_NAME,
        name: obj.OBJECT_ID,
        longitude: position.longitude,
        latitude: position.latitude,
      });
    }
  }

  return result;
}



export default function Home() {
  const [objects, setObjects] = useState<GlobePoint[]>(() =>
    computeSatellitePositions(new Date()),
  );
 
  useEffect(() => {
    const intervalRef = { current: null as ReturnType<typeof setInterval> | null };
 
    const tick = () => setObjects(computeSatellitePositions(new Date()));
 
    const start = () => {
      if (intervalRef.current) return;
      tick();
      intervalRef.current = setInterval(tick, REFRESH_INTERVAL_MS);
    };
    const stop = () => {
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
 
    const handleVisibility = () => (document.hidden ? stop() : start());
 
    start();
    document.addEventListener("visibilitychange", handleVisibility);
 
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);
 
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const hovered = objects.find((s) => s.id === hoveredId) ?? null;
  const selected = objects.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="absolute h-full w-full">
      <Map zoom={1} projection={{ type: "globe" }}>
        <MapPoints
          data={objects}
          paint={{
            "circle-radius": 2,
            "circle-color": "#3b82f6",
          }}
          hoverPaint={{
            "circle-radius": 4,
            "circle-color": "#60a5fa",
          }}
          onClick={(e) => setSelectedId(e?.point.id ?? null)}
          onHover={(e) => setHoveredId(e?.point.id ?? null)}
        />
 
        {hovered && !selected && (
          <MapMarker longitude={hovered.longitude} latitude={hovered.latitude}>
            <MarkerContent className="pointer-events-none">
              <div className="size-2 rounded-full border-2 border-white bg-blue-400" />
              <MarkerLabel position="top">{hovered.name}</MarkerLabel>
            </MarkerContent>
          </MapMarker>
        )}
        {selectedId && (
        <MapPopup
            longitude={selected.longitude}
            latitude={selected.latitude}
            // onClose={() => setSelectedId(null)}
            closeButton
            focusAfterOpen={false}
            closeOnClick={false}
          >
            <div className="space-y-2">
              <h3 className="text-foreground font-semibold">{selected.name} - {selected.id}</h3>
              <p className="text-muted-foreground text-sm">
                {selected.type}
              </p>
            </div>
          </MapPopup>
        )}
      </Map>
    </div>
  );
}