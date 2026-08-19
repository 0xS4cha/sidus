const EARTH_RADIUS_KM = 6371;
const EARTH_RADIUS = 1;

export function latLonToVector3(
    latitude: number,
    longitude: number,
    altitudeKm: number
) {
    const radius =
        EARTH_RADIUS * (1 + altitudeKm / EARTH_RADIUS_KM);

    const lat = latitude * Math.PI / 180;
    const lon = longitude * Math.PI / 180;

    return [
        radius * Math.cos(lat) * Math.cos(lon),
        radius * Math.sin(lat),
        radius * Math.cos(lat) * Math.sin(lon),
    ] as [number, number, number];
}