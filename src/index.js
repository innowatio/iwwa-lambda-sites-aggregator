import "babel-polyfill";
import router from "kinesis-router";

import handleUpsert from "./handle-upsert";

export const handler = router()
    .on("element inserted in collection sites", handleUpsert)
    .on("element replaced in collection sites", handleUpsert);
