import * as satellite from "satellite.js";

import { SatelliteOMM } from "@/types/satellite";

export function getSatellitePosition(
  data: SatelliteOMM,
  date: Date = new Date()
) {
    const satrec = satellite.json2satrec(data);

    const state = satellite.propagate(satrec, date);
    if (!state) {
        // console.log(`${data.OBJECT_NAME} has SGP4 error: ${satrec.error}`)
        return null;
    }
    const positionEci = state.position;

    const gmst = satellite.gstime(date);

    const geodetic = satellite.eciToGeodetic(
        positionEci,
        gmst
    );

    return {
        latitude: satellite.radiansToDegrees(geodetic.latitude),
        longitude: satellite.radiansToDegrees(geodetic.longitude),
        altitude: geodetic.height,

        eci: {
            x: positionEci.x,
            y: positionEci.y,
            z: positionEci.z,
        },

        velocity: {
            x: state.velocity.x,
            y: state.velocity.y,
            z: state.velocity.z,
        },
    };
}