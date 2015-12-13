import dotenv from "dotenv";
dotenv.load();

export const MONGODB_URL = process.env.MONGODB_URL;
export const SITES_COLLECTION_NAME = "sites";
export const DEBUG = process.env.DEBUG;
