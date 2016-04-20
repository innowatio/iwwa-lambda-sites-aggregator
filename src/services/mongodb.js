import {MongoClient} from "mongodb";

import {MONGODB_URL} from "../config";

const connection = MongoClient.connect(MONGODB_URL);

export async function getCollection (collectionName) {
    const db = await connection;
    return db.collection(collectionName);
}
