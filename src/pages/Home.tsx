import { useMemo, memo } from "react";
import { getSatellitePosition } from "@/lib/getSatellitePosition";
import { SatelliteOMM } from "@/types/satellite";
import SatelliteList from "@/assets/test.json";
import {
  Map,
  MapMarker,
  MarkerContent,
  // MarkerLabel,
} from "@/components/ui/map";

interface Destination {
  name: string;
  lng: number;
  lat: number;
}


const SatelliteMarker = memo(function SatelliteMarker({
  dest,
}: {
  dest: Destination;
}) {
  return (
    <MapMarker longitude={dest.lng} latitude={dest.lat}>
      <MarkerContent>
        <div className="size-2 rounded-full border-2 border-white bg-blue-500" />
        {/* <MarkerLabel position="top">{dest.name}</MarkerLabel> */}
      </MarkerContent>
    </MapMarker>
  );
});

export default function Home() {
  const destinations = useMemo<Destination[]>(() => {
    const result: Destination[] = [];
    for (const satellite of SatelliteList as SatelliteOMM[]) {
      const position = getSatellitePosition(satellite);
      if (position) {
        result.push({
          name: satellite.OBJECT_NAME,
          lng: position.longitude,
          lat: position.latitude,
        });
      }
    }
    return result;
  }, []);

  return (
    <div className="absolute h-full w-full">
      <Map zoom={1} projection={{ type: "globe" }}>
        {destinations.map((dest) => (
          <SatelliteMarker key={dest.name} dest={dest} />
        ))}
      </Map>
    </div>
  );
}