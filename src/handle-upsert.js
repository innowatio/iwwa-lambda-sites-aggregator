import {concat, flatten, map, pipe} from "ramda";

import {SITES_COLLECTION_NAME} from "./config";
import {collection} from "./services/mongodb";

function getSensorsIds (sensor) {
    return pipe(
        map(getSensorsIds),
        flatten,
        concat([sensor.id])
    )(sensor.children || []);
}

export default async function handleUpsert (event, actionDelete) {
    const site = {
        ...event.data.element
    };
    const id = event.data.id;
    const sensorsIds = pipe(
        map(getSensorsIds),
        flatten
    )(site.children || []);

    const update = actionDelete ?
        {$set: {isDeleted: true}} :
        {...site, sensorsIds, isDeleted: actionDelete};

    await collection(SITES_COLLECTION_NAME).update(
        {_id: id},
        update,
        {upsert: true}
    );
    return null;
}
