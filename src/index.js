import "babel-polyfill";
import router from "kinesis-router";
import {partialRight} from "ramda";

import handleUpsert from "./handle-upsert";

export const handler = router()
    .on("element inserted in collection sites", partialRight(handleUpsert, [false]))
    .on("element replaced in collection sites", partialRight(handleUpsert, [false]))
    .on("element removed in collection sites", partialRight(handleUpsert, [true]));
