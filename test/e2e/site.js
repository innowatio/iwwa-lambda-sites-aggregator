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

});
