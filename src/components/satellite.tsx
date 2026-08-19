import { GlobePoint } from "@/types/points"
import { latLonToVector3 } from "@/lib/latLonToVector3";

export function Satellite({ object }: { object: GlobePoint }) {
    const position = latLonToVector3(
        object.latitude,
        object.longitude,
        object.altitude
    );

    return (
        <mesh position={position}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial color="red" />
        </mesh>
    );
}