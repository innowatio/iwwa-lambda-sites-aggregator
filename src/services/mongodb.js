import {MongoClient} from "mongodb";

import {MONGODB_URL} from "../config";

var mongoClientInstance;

export async function getMongoClient () {
    if (!mongoClientInstance) {
        mongoClientInstance = await MongoClient.connect(MONGODB_URL);
    }
    return mongoClientInstance;
}

export async function getCollection (collectionName) {
    const db = await getMongoClient();
    return db.collection(collectionName);
}
