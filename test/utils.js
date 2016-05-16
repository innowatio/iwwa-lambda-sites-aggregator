export function siteEvent (action) {
    return {
        id: "eventId",
        data: {
            id: "siteId",
            element: {
                sensors: [
                    {
                        id: "sensorId1",
                        children: [{
                            id: "sensorId11",
                            children: [
                                {
                                    id: "sensorId111"
                                },
                                {
                                    id: "sensorId112"
                                }
                            ]
                        }]
                    },
                    {
                        id: "sensorId2"
                    }
                ]
            }
        },
        timestamp: 1420070400000,
        type: `element ${action} in collection sites`
    };
}

export const siteOnDB = {
    _id: "siteId",
    sensors: [
        {
            id: "sensorId1",
            children: [{
                id: "sensorId11",
                children: [
                    {
                        id: "sensorId111"
                    },
                    {
                        id: "sensorId112"
                    }
                ]
            }]
        },
        {
            id: "sensorId2"
        }
    ],
    isDeleted: false,
    sensorsIds: [
        "sensorId1",
        "sensorId11",
        "sensorId111",
        "sensorId112",
        "sensorId2"
    ]
};
