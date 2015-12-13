import {concat, flatten, map, pipe} from "ramda";

import * as config from "./config";
import {collection} from "./services/mongodb";

function getSensorsIds (sensor) {
    return pipe(
        map(getSensorsIds),
        flatten,
        concat([sensor.id])
    )(sensor.children || []);
}

export default async function handleUpsert (event) {
    const site = event.data.element;
    const id = event.data.id;
    const sensorsIds = pipe(
        map(getSensorsIds),
        flatten
    )(site.sensors);
    await collection(config.SITES_COLLECTION_NAME).update(
        {_id: id},
        {...site, sensorsIds},
        {upsert: true}
    );
    return null;
}
