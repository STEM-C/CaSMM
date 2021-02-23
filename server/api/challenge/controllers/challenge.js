'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find() {
        return {
            "classroom": {
                "id": 1,
                "name": "Pedros Science Classroom",
                "school": 1,
                "code": "0450",
                "grade": {
                    "id": 4,
                    "name": "5th",
                    "created_at": "2020-07-24T16:21:42.095Z",
                    "updated_at": "2020-07-24T16:21:42.095Z"
                },
    
                "created_at": "2020-07-24T16:31:53.641Z",
                "updated_at": "2021-02-03T18:43:43.869Z"
            },
            "learning_standards": [{
                    "id": 1,
                    "unit": 1,
                    "number": 1.3,
                    "name": "Mixtures and Solutions",
                    "expectations": "Demonstrate that some mixtures maintain physical properties of their ingredients such as iron fillings and sand and sand and water.\nIdentify changes that can occur in the physical properties of the ingredients or solutions such as dissolving salt in water or adding lemon juice to water.",
                    "created_at": "2020-07-24T16:53:26.737Z",
                    "updated_at": "2020-10-26T15:55:56.582Z",
                    "teks": null,
                    "days": [{
                        "id": 3,
                        "learning_standard": 1,
                        "number": "3",
                        "template": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"io_digitalwrite\" id=\"j#m#H23NIQH5Wz^I2c^G\" x=\"70\" y=\"224\"><field name=\"PIN\">0</field><value name=\"STATE\"><block type=\"io_highlow\" id=\"7.^n|ek_3R;_Q`K9M!;/\"><field name=\"STATE\">HIGH</field></block></value></block></xml>",
                        "created_at": "2020-07-24T16:57:43.433Z",
                        "updated_at": "2020-07-24T17:15:26.202Z"
                    }, {
                        "id": 17,
                        "learning_standard": 1,
                        "number": "1",
                        "template": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"></xml>)",
                        "created_at": "2020-11-30T15:45:33.387Z",
                        "updated_at": "2020-11-30T15:45:33.496Z"
                    }, {
                        "id": 18,
                        "learning_standard": 1,
                        "number": "2",
                        "template": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"></xml>)",
                        "created_at": "2020-11-30T15:45:35.939Z",
                        "updated_at": "2020-11-30T15:45:35.991Z"
                    }]
                },
                {
                    "id": 3,
                    "unit": 1,
                    "number": 3,
                    "name": "Water Cycle",
                    "expectations": "Students Learn about Water Cycle",
                    "created_at": "2020-11-02T18:26:22.320Z",
                    "updated_at": "2020-11-02T18:26:22.344Z",
                    "teks": null,
                    "days": [{
                        "id": 4,
                        "learning_standard": 3,
                        "number": "1",
                        "template": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"></xml>",
                        "created_at": "2020-11-02T18:26:22.445Z",
                        "updated_at": "2021-01-27T18:25:30.001Z"
                    }, {
                        "id": 5,
                        "learning_standard": 3,
                        "number": "2",
                        "template": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"></xml>)",
                        "created_at": "2020-11-02T18:26:22.607Z",
                        "updated_at": "2020-11-02T18:26:22.621Z"
                    }, {
                        "id": 6,
                        "learning_standard": 3,
                        "number": "3",
                        "template": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"></xml>)",
                        "created_at": "2020-11-02T18:26:22.735Z",
                        "updated_at": "2020-11-02T18:26:22.750Z"
                    }, {
                        "id": 7,
                        "learning_standard": 3,
                        "number": "4",
                        "template": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"></xml>)",
                        "created_at": "2020-11-02T18:26:22.848Z",
                        "updated_at": "2020-11-02T18:26:22.865Z"
                    }]
                }
            ]
        }
    },
};
