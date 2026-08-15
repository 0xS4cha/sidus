import { ArcExample } from "@/components/ui/ArcExample"

const hub = { name: "London", lng: -0.1276, lat: 51.5074 };

const destinations = [
  { name: "New York", lng: -74.006, lat: 40.7128 },
  { name: "São Paulo", lng: -46.6333, lat: -23.5505 },
  { name: "Cape Town", lng: 18.4241, lat: -33.9249 },
  { name: "Dubai", lng: 55.2708, lat: 25.2048 },
  { name: "Mumbai", lng: 72.8777, lat: 19.076 },
  { name: "Singapore", lng: 103.8198, lat: 1.3521 },
  { name: "Tokyo", lng: 139.6917, lat: 35.6895 },
  { name: "Sydney", lng: 151.2093, lat: -33.8688 },
];

const arcs = destinations.map((dest) => ({
  id: dest.name,
  from: [hub.lng, hub.lat] as [number, number],
  to: [dest.lng, dest.lat] as [number, number],
}));

export default function Home() {
  return (
    <div className="h-full w-full">
      <ArcExample />
    </div>
  );
}
