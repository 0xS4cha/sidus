import { Instance } from "@react-three/drei";
import { GlobePoint } from "@/types/points";
import { latLonToVector3 } from "@/lib/latLonToVector3";

export function Satellite({ object }: { object: GlobePoint }) {
    const position = latLonToVector3(
        object.latitude,
        object.longitude,
        object.altitude
    );

    return <Instance position={position} />;
}