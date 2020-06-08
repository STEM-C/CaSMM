module.exports = {
    topics: [{
        "id": 1,
        "name": "Topic #1",
        "description": "Topic 1",
        "type": {
            "id": 1,
            "name": "SCIENCE",
            "created_at": "2020-04-14T04:51:59.000Z",
            "updated_at": "2020-04-14T04:51:59.000Z"
        },
        "created_at": "2020-04-14T04:52:39.000Z",
        "updated_at": "2020-06-06T20:27:20.948Z",
        "activities": [{
            "id": 1,
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
            "template": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"controls_whileUntil\" id=\"x?aQ2Ij%NKm^R;h7NbAM\" x=\"236\" y=\"69\"><field name=\"MODE\">WHILE</field></block><block type=\"controls_whileUntil\" id=\"7=(cY}#G8;84zSH9X=#i\" x=\"271\" y=\"141\"><field name=\"MODE\">WHILE</field></block></xml>",
            "created_at": "2020-03-31T15:56:45.000Z",
            "updated_at": "2020-06-08T01:05:09.681Z"
        }]
    }],
    toolbox: {
        "id": "1",
        "toolbox": [
            [
                "Control",
                [{
                        "name": "controls_if",
                        "description": null
                    },
                    {
                        "name": "controls_for",
                        "description": null
                    }
                ]
            ],
            [
                "Logic",
                [{
                        "name": "logic_operation",
                        "description": null
                    },
                    {
                        "name": "logic_boolean",
                        "description": null
                    }
                ]
            ],
            [
                "Math",
                [{
                        "name": "math_change",
                        "description": null
                    },
                    {
                        "name": "math_constrain",
                        "description": null
                    }
                ]
            ],
            [
                "Text",
                [{
                        "name": "text_append",
                        "description": null
                    },
                    {
                        "name": "text_length",
                        "description": null
                    }
                ]
            ]
        ]
    },
    compile: {
        request: {
            "board": "arduino:avr:uno",
            "sketch": "void setup() { } void loop() { while (false) { } while (false) { } }"
        },
        response: {
            "success": true,
            "hex": "OjEwMDAwMDAwMEM5NDM0MDAwQzk0NDYwMDBDOTQ0NjAwMEM5NDQ2MDA2QQ0KOjEwMDAxMDAwMEM5NDQ2MDAwQzk0NDYwMDBDOTQ0NjAwMEM5NDQ2MDA0OA0KOjEwMDAyMDAwMEM5NDQ2MDAwQzk0NDYwMDBDOTQ0NjAwMEM5NDQ2MDAzOA0KOjEwMDAzMDAwMEM5NDQ2MDAwQzk0NDYwMDBDOTQ0NjAwMEM5NDQ2MDAyOA0KOjEwMDA0MDAwMEM5NDQ4MDAwQzk0NDYwMDBDOTQ0NjAwMEM5NDQ2MDAxNg0KOjEwMDA1MDAwMEM5NDQ2MDAwQzk0NDYwMDBDOTQ0NjAwMEM5NDQ2MDAwOA0KOjEwMDA2MDAwMEM5NDQ2MDAwQzk0NDYwMDExMjQxRkJFQ0ZFRkQ4RTAzQw0KOjEwMDA3MDAwREVCRkNEQkYyMUUwQTBFMEIxRTAwMUMwMUQ5MkE5MzBGQw0KOjEwMDA4MDAwQjIwN0UxRjcwRTk0OTIwMDBDOTREQzAwMEM5NDAwMDA4Rg0KOjEwMDA5MDAwMUY5MjBGOTIwRkI2MEY5MjExMjQyRjkzM0Y5MzhGOTNCRA0KOjEwMDBBMDAwOUY5M0FGOTNCRjkzODA5MTA1MDE5MDkxMDYwMUEwOTExQQ0KOjEwMDBCMDAwMDcwMUIwOTEwODAxMzA5MTA0MDEyM0UwMjMwRjJEMzc4Rg0KOjEwMDBDMDAwMjBGNDAxOTZBMTFEQjExRDA1QzAyNkU4MjMwRjAyOTY1Qw0KOjEwMDBEMDAwQTExREIxMUQyMDkzMDQwMTgwOTMwNTAxOTA5MzA2MDE5OQ0KOjEwMDBFMDAwQTA5MzA3MDFCMDkzMDgwMTgwOTEwMDAxOTA5MTAxMDE1NA0KOjEwMDBGMDAwQTA5MTAyMDFCMDkxMDMwMTAxOTZBMTFEQjExRDgwOTM1MQ0KOjEwMDEwMDAwMDAwMTkwOTMwMTAxQTA5MzAyMDFCMDkzMDMwMUJGOTFGQw0KOjEwMDExMDAwQUY5MTlGOTE4RjkxM0Y5MTJGOTEwRjkwMEZCRTBGOTBCNA0KOjEwMDEyMDAwMUY5MDE4OTU3ODk0ODRCNTgyNjA4NEJEODRCNTgxNjBGMQ0KOjEwMDEzMDAwODRCRDg1QjU4MjYwODVCRDg1QjU4MTYwODVCRDgwOTFCMg0KOjEwMDE0MDAwNkUwMDgxNjA4MDkzNkUwMDEwOTI4MTAwODA5MTgxMDAyQQ0KOjEwMDE1MDAwODI2MDgwOTM4MTAwODA5MTgxMDA4MTYwODA5MzgxMDAyMg0KOjEwMDE2MDAwODA5MTgwMDA4MTYwODA5MzgwMDA4MDkxQjEwMDg0NjBFNA0KOjEwMDE3MDAwODA5M0IxMDA4MDkxQjAwMDgxNjA4MDkzQjAwMDgwOTE0NQ0KOjEwMDE4MDAwN0EwMDg0NjA4MDkzN0EwMDgwOTE3QTAwODI2MDgwOTMwNA0KOjEwMDE5MDAwN0EwMDgwOTE3QTAwODE2MDgwOTM3QTAwODA5MTdBMDA2MQ0KOjEwMDFBMDAwODA2ODgwOTM3QTAwMTA5MkMxMDBDMEUwRDBFMDIwOTc3MA0KOjBDMDFCMDAwRjFGMzBFOTQwMDAwRkJDRkY4OTRGRkNGOTkNCjowMDAwMDAwMUZGDQo=",
            "stdout": "Sketch uses 444 bytes (1%) of program storage space. Maximum is 32256 bytes.\nGlobal variables use 9 bytes (0%) of dynamic memory, leaving 2039 bytes for local variables. Maximum is 2048 bytes.\n",
            "stderr": ""
        }
    }
}