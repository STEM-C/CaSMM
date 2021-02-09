'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find() {
        return [
            {
                "id": 1,
                "name": "Topic #1",
                "description": "This is it",
                "type": 1,
                "created_at": "2020-04-14T04:52:39.000Z",
                "updated_at": "2020-05-26T02:13:47.153Z",
                "activities": [
                    {
                        "id": 4,
                        "name": "Activity #3",
                        "description": "This is the third activity, meant to show off just the Control block category.",
                        "difficulty": {
                            "id": 1,
                            "name": "LOW",
                            "created_at": "2020-03-31T15:47:22.000Z",
                            "updated_at": "2020-03-31T15:47:22.000Z"
                        },
                        "learning_category": {
                            "id": 3,
                            "name": "MAKER_TOOLS",
                            "created_at": "2020-03-31T15:45:14.000Z",
                            "updated_at": "2020-03-31T15:45:14.000Z"
                        },
                        "topic": 1,
                        "created_at": "2020-04-02T15:15:34.000Z",
                        "updated_at": "2020-05-26T02:13:47.151Z"
                    }
                ]
            },
            {
                "id": 2,
                "name": "Topic #2",
                "description": "This is it",
                "type": 2,
                "created_at": "2020-04-14T04:52:46.000Z",
                "updated_at": "2020-05-26T02:13:39.054Z",
                "activities": [
                    {
                        "id": 2,
                        "name": "Activity #1",
                        "description": "This is the first activity, meant to show off two of the categories in the toolbox.",
                        "difficulty": {
                            "id": 2,
                            "name": "MEDIUM",
                            "created_at": "2020-03-31T15:47:26.000Z",
                            "updated_at": "2020-03-31T15:47:26.000Z"
                        },
                        "learning_category": {
                            "id": 1,
                            "name": "ENABLED_LEARNING",
                            "created_at": "2020-03-31T15:45:01.000Z",
                            "updated_at": "2020-03-31T15:45:01.000Z"
                        },
                        "topic": 2,
                        "created_at": "2020-03-31T15:56:45.000Z",
                        "updated_at": "2020-05-26T02:13:39.052Z"
                    },
                    {
                        "id": 3,
                        "name": "Activity #2",
                        "description": "This is the second activity, meant to show off just the logic block category.",
                        "difficulty": {
                            "id": 2,
                            "name": "MEDIUM",
                            "created_at": "2020-03-31T15:47:26.000Z",
                            "updated_at": "2020-03-31T15:47:26.000Z"
                        },
                        "learning_category": {
                            "id": 2,
                            "name": "DEMONSTRATE_LEARNING",
                            "created_at": "2020-03-31T15:45:10.000Z",
                            "updated_at": "2020-03-31T15:45:10.000Z"
                        },
                        "topic": 2,
                        "created_at": "2020-03-31T18:07:23.000Z",
                        "updated_at": "2020-05-26T02:13:39.052Z"
                    },
                    {
                        "id": 5,
                        "name": "Activity #5",
                        "description": "This is the fifth activity, meant to show off every possible category in the toolbox.",
                        "difficulty": {
                            "id": 3,
                            "name": "HIGH",
                            "created_at": "2020-03-31T15:47:29.000Z",
                            "updated_at": "2020-03-31T15:47:29.000Z"
                        },
                        "learning_category": {
                            "id": 1,
                            "name": "ENABLED_LEARNING",
                            "created_at": "2020-03-31T15:45:01.000Z",
                            "updated_at": "2020-03-31T15:45:01.000Z"
                        },
                        "topic": 2,
                        "created_at": "2020-04-15T21:30:02.000Z",
                        "updated_at": "2020-05-26T02:13:39.052Z"
                    }
                ]
            }
        ]
    },
};
