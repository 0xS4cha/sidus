import { useState, useEffect } from "react";
import { getSatellitePosition } from "@/lib/getSatellitePosition";
import { SatelliteOMM } from "@/types/satellite";
import { StationOMM } from "@/types/station";
import SatelliteList from "@/assets/satellites.json";
import StationList from "@/assets/stations.json";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Satellite, RadioTower } from "lucide-react";

import {
  Map,
  MapPoints,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MapPopup,
  MapControls,
  type MapPointsDatum,
} from "@/components/ui/map";

const ObjTypes = {
  satellite: "satellite",
  station: "station",
} as const;

type ObjType = typeof ObjTypes[keyof typeof ObjTypes];

const ObjCompanies = {
  starlink: "Starlink",
  unknow: "Unknow",
} as const;

type ObjCompany = typeof ObjCompanies[keyof typeof ObjCompanies];

interface GlobePoint extends MapPointsDatum {
  company: ObjCompany;
  type: ObjType;
  name: string;
}

const REFRESH_INTERVAL_MS = 500;

function computeSatellitePositions(now: Date): GlobePoint[] {
  const result: GlobePoint[] = [];
  for (const obj of SatelliteList as SatelliteOMM[]) {
    const position = getSatellitePosition(obj, now);
    if (position) {
      const company = obj.OBJECT_NAME.includes("STARLINK") ? ObjCompanies.starlink : ObjCompanies.unknow
      result.push({
        type: ObjTypes.satellite,
        company: company,
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
        company: ObjCompanies.unknow,
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
        <MapControls
          position="top-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />
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

        {selected && (
          <MapPopup
            longitude={selected.longitude}
            latitude={selected.latitude}
            closeButton
            focusAfterOpen={false}
            closeOnClick={false}
            className="rounded-xl border bg-popover p-0 shadow-lg"
          >
            <div className="w-64 space-y-3 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {selected.type === ObjTypes.satellite ? (
                    <Satellite className="size-4" />
                  ) : (
                    <RadioTower className="size-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold leading-tight text-foreground">
                    {selected.name}
                  </h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {selected.id}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {selected.type}
                </Badge>
                <Badge
                  variant={selected.company === ObjCompanies.starlink ? "default" : "outline"}
                >
                  {selected.company}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <span className="block text-[10px] uppercase tracking-wide">
                    Latitude
                  </span>
                  <span className="font-mono text-foreground">
                    {selected.latitude.toFixed(3)}°
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wide">
                    Longitude
                  </span>
                  <span className="font-mono text-foreground">
                    {selected.longitude.toFixed(3)}°
                  </span>
                </div>
              </div>
            </div>
          </MapPopup>
        )}
      </Map>
    </div>
  );
}