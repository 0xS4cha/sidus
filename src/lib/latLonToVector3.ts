const EARTH_RADIUS_KM = 6371;
const EARTH_RADIUS = 1;

export function latLonToVector3(
    latitude: number,
    longitude: number,
    altitudeKm: number
): [number, number, number] {
    const radius = EARTH_RADIUS * (1 + altitudeKm / EARTH_RADIUS_KM);

    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 180) * (Math.PI / 180);

    return [
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
    ];
}
