import {concat, flatten, map, pipe} from "ramda";

import {SITES_COLLECTION_NAME} from "./config";
import {getCollection} from "./services/mongodb";

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
    )(site.sensors || []);

    const update = actionDelete ?
        {...site, isDeleted: true} :
        {...site, sensorsIds, isDeleted: actionDelete, _id: id};

    const sitesCollection = await getCollection(SITES_COLLECTION_NAME);
    await sitesCollection.update(
        {_id: id},
        {$set: update},
        {upsert: true}
    );
    return null;
}
