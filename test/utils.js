export function siteEvent (action) {
    return {
        id: "eventId",
        data: {
            element: {
                children: [
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
            },
            id: "siteId"
        },
        timestamp: 1420070400000,
        type: `element ${action} in collection sites`
    };
}

export const siteOnDB = {
    _id: "siteId",
    children: [
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
