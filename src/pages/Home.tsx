import { useState, useEffect, useRef } from "react";
import { computePositions } from "@/lib/computePosition"
import { layers } from "@/lib/layers"
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GlobePoint } from "@/types/points"
import {
  Satellite,
  RadioTower,
} from "lucide-react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"

import {
  Map,
  MapPoints,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MapPopup,
  MapControls,
} from "@/components/ui/map";


const REFRESH_INTERVAL_MS = 500;



export default function Home() {
  const [objects, setObjects] = useState<GlobePoint[]>([])
  const [activeLayers, setActiveLayers] = useState<Set<string>>(
    () => new Set(layers.filter(l => l.defaultActive).map(l => l.id))
  );

  const activeLayersRef = useRef(activeLayers);
  useEffect(() => { activeLayersRef.current = activeLayers; }, [activeLayers]);

  useEffect(() => {
    const tick = () => setObjects(computePositions(new Date(), activeLayersRef.current));
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => { if (!id) { tick(); id = setInterval(tick, REFRESH_INTERVAL_MS); } };
    const stop = () => { if (id) { clearInterval(id); id = null; } };
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const toggleLayer = (id: string) =>
    setActiveLayers(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const [viewCommands, setViewCommands] = useState<boolean>(false);

  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const hovered = objects.find((s) => s.id === hoveredId) ?? null;
  const selected = objects.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="absolute h-full w-full">
      <div className="flex flex-col gap-4">
        <CommandDialog open={viewCommands} onOpenChange={setViewCommands}>
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Layers">
                {layers.map(({ id, label, icon: Icon }) => (
                  <CommandItem key={id} onSelect={() => toggleLayer(id)}>
                    <Icon />
                    <span>{activeLayers.has(id) ? `Disable ${label}` : `Enable ${label}`}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
      </div>
      <Map zoom={1} projection={{ type: "globe" }}>
        <MapControls
          position="top-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
          showCommands
          setCommands={setViewCommands}
          commands={viewCommands}
        />
        <MapPoints
          data={objects}
          paint={{
            "circle-radius": 5,
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
                  {selected.type === "satellite" ? (
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
                  variant={selected.company === "starlink" ? "default" : "outline"}
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