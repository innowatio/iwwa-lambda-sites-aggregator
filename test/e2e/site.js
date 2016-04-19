import {all, resolve} from "bluebird";
import {expect} from "chai";

import {handler} from "index";
import * as mongodb from "services/mongodb";
import * as events from "../events";
import {getEventFromObject, run} from "../mock";

describe("On site insert", () => {

    const sites = mongodb.collection("sites");

    beforeEach(() => {
        return resolve()
            .then(() => all([
                sites.remove({})
            ]));
    });

    it("creates a site element", () => {
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

    it("updates a site element", async () => {
        sites.insert({
            "id": "siteId",
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
            "type": "element removed in collection sites"
        });

        await run(handler, event);
        const updatedSite = await sites.findOne({"_id": "siteId"}, {"children": 1});
        expect({
            "_id": "siteId",
            "children": [
                {
                    "id": "sensorId2"
                }
            ]
        }).to.deep.equal(updatedSite);
    });

    it("deletes a site element", () => {
        sites.insert({
            "id": "siteId",
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
        return run(handler, event)
            .then(() => sites.findOne({"_id": "siteId"}))
            .then(updatedSite => expect(updatedSite.isDeleted).to.equal(true));
    });
});
