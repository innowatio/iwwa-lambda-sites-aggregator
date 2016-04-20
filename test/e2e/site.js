import {expect} from "chai";

import {handler} from "index";
import * as mongodb from "services/mongodb";
import * as utils from "../utils";
import {getEventFromObject, run} from "../mock";

describe("On site", () => {

    var sites;

    before(async () => {
        sites = await mongodb.collection("sites");
    });

    afterEach(async () => {
        await sites.remove({});
    });

    it("INSERT a site element", async () => {
        const event = getEventFromObject(utils.siteEvent("inserted"));
        const expected = utils.siteOnDB;

        await run(handler, event);
        const sensorsOnDB = await sites.findOne({"_id": "siteId"});
        expect(sensorsOnDB).to.deep.equal(expected);
    });

    it("correctly fills the sensorsIds property", async () => {
        const event = getEventFromObject(utils.siteEvent("inserted"));

        await run(handler, event);
        const sensorsOnDB = await sites.findOne({"_id": "siteId"});
        expect(sensorsOnDB.sensorsIds.sort()).to.deep.equal([
            "sensorId1",
            "sensorId11",
            "sensorId111",
            "sensorId112",
            "sensorId2"
        ].sort());
    });

    it("UPDATE a site element", async () => {
        await sites.insert(utils.siteOnDB);
        const event = getEventFromObject({
            "data": {
                id: "siteId",
                element: {
                    children: [
                        {
                            id: "sensorId2"
                        }
                    ]
                }
            },
            timestamp: 1420070400000,
            type: "element replaced in collection sites"
        });
        const expected = {
            _id: "siteId",
            children: [
                {
                    id: "sensorId2"
                }
            ],
            sensorsIds: ["sensorId2"],
            isDeleted: false
        };

        await run(handler, event);
        const updatedSite = await sites.findOne({"_id": "siteId"});
        expect(expected).to.deep.equal(updatedSite);
    });

    it("DELETE a site element", async () => {
        await sites.insert(utils.siteOnDB);
        const event = getEventFromObject({
            data: {
                id: "siteId"
            },
            timestamp: 1420070400000,
            type: "element removed in collection sites"
        });
        const expected = {...utils.siteOnDB, isDeleted: true};

        await run(handler, event);
        const updatedSite = await sites.findOne({_id: "siteId"});
        expect(expected).to.deep.equal(updatedSite);
    });
});
