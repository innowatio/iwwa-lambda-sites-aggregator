import {all, resolve} from "bluebird";
import {expect} from "chai";

import {handler} from "index";
import * as mongodb from "services/mongodb";
import * as events from "../events";
import {getEventFromObject, run} from "../mock";

describe("On site", () => {

    const sites = mongodb.collection("sites");

    afterEach(() => {
        return resolve()
            .then(() => all([
                sites.remove({})
            ]));
    });

    it("INSERT a site element", () => {
        const event = getEventFromObject(events.siteInserted);
        return run(handler, event)
            .then(() => sites.count({}))
            .then(count => expect(count).to.equal(1));
    });

    it("correctly fills the sensorsIds property", () => {
        const event = getEventFromObject(events.siteInserted);
        return run(handler, event)
            .then(() => sites.findOne({}))
            .then(site => {
                expect(site.sensorsIds.sort()).to.deep.equal([
                    "sensorId1",
                    "sensorId11",
                    "sensorId111",
                    "sensorId112",
                    "sensorId2"
                ].sort());
            });
    });

    it("UPDATE a site element", async () => {
        await sites.insert({
            "_id": "siteId",
            "children": [
                {
                    "id": "sensorId1",
                    "children": [{
                        "id": "sensorId11",
                        "children": [
                            {
                                "id": "sensorId111"
                            },
                            {
                                "id": "sensorId112"
                            }
                        ]
                    }]
                },
                {
                    "id": "sensorId2"
                }
            ],
            "isDeleted": false
        });

        const event = getEventFromObject({
            "data": {
                "id": "siteId",
                "element": {
                    "children": [
                        {
                            "id": "sensorId2"
                        }
                    ]
                }
            },
            "timestamp": 1420070400000,
            "type": "element replaced in collection sites"
        });

        await run(handler, event);
        const updatedSite = await sites.findOne({"_id": "siteId"}, {"children": 1, "isDeleted": 1});
        expect({
            "_id": "siteId",
            "children": [
                {
                    "id": "sensorId2"
                }
            ],
            "isDeleted": false
        }).to.deep.equal(updatedSite);
    });

    it("DELETE a site element", async () => {
        await sites.insert({
            "_id": "siteId",
            "children": [
                {
                    "id": "sensorId1",
                    "children": [{
                        "id": "sensorId11",
                        "children": [
                            {
                                "id": "sensorId111"
                            },
                            {
                                "id": "sensorId112"
                            }
                        ]
                    }]
                },
                {
                    "id": "sensorId2"
                }
            ],
            "isDeleted": false
        });

        const event = getEventFromObject({
            "data": {
                "id": "siteId"
            },
            "timestamp": 1420070400000,
            "type": "element removed in collection sites"
        });

        await run(handler, event);
        const updatedSite = await sites.findOne({"_id": "siteId"});
        expect(updatedSite).to.deep.equal({
            "_id": "siteId",
            "children": [
                {
                    "id": "sensorId1",
                    "children": [{
                        "id": "sensorId11",
                        "children": [
                            {
                                "id": "sensorId111"
                            },
                            {
                                "id": "sensorId112"
                            }
                        ]
                    }]
                },
                {
                    "id": "sensorId2"
                }
            ],
            "isDeleted": true
        });
    });
});
