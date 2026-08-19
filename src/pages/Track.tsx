import { Canvas, useLoader } from '@react-three/fiber'
import { useState, useEffect, useRef } from "react";
import { OrbitControls } from '@react-three/drei'
import { TextureLoader } from 'three'
import { GlobePoint } from "@/types/points"
import { computePositions } from "@/lib/computePosition"
import { layers } from "@/lib/layers"
import { Satellite } from '@/components/satellite';
import earthTexture from "@/assets/earth-realistic-8k.webp"
// import { useSearchParams } from "react-router-dom";

const REFRESH_INTERVAL_MS = 500;

export default function Track() {
    const texture = useLoader(TextureLoader, earthTexture);

    // const [searchParams] = useSearchParams();

    // const obj = searchParams.get("obj");

    // console.log(obj);


    const [objects, setObjects] = useState<GlobePoint[]>([])
    const [activeLayers, setActiveLayers] = useState<Set<string>>(
        () => new Set(layers.filter(l => l.defaultActive).map(l => l.id))
    );
    
    const activeLayersRef = useRef(activeLayers);
    useEffect(() => { activeLayersRef.current = activeLayers; }, [activeLayers]);

    // useEffect(() => {
    //     const tick = () => setObjects(computePositions(new Date(), activeLayersRef.current));
    //     let id: ReturnType<typeof setInterval> | null = null;
    //     const start = () => { if (!id) { tick(); id = setInterval(tick, REFRESH_INTERVAL_MS); } };
    //     const stop = () => { if (id) { clearInterval(id); id = null; } };
    //     const onVis = () => (document.hidden ? stop() : start());
    //     start();
    //     document.addEventListener("visibilitychange", onVis);
    //     return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
    // }, []);

    const toggleLayer = (id: string) =>
    setActiveLayers(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });
    console.log(objects);
    return (
    <div className="absolute h-full w-full">
        <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="white" map={texture} />
            <OrbitControls />
        </mesh>
        {objects.map((object) => (
            <Satellite
                key={object.id}
                object={object}
            />
        ))}
        
        </Canvas>
    </div>
    )
}