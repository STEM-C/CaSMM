# Compile

Arduino compilier service

<br/>

## Setup

To run Compile with the rest of the application, see the project [development](../#development) setup.

### Development

1. Install [docker](https://docs.docker.com/get-docker/)
2. Build the Compile image `npm run build` 
3. Start a new container from the image `npm run new`

Additional scripts:

* Start an existing container `npm run start`
* Connect to the running container's bash `npm run bash` 

<br/>

## API

The interface for this service is simple. There are three informational endpoints and one endpoint for compiling arduino code.

| Method | Path       | Description                                   |
| ------ | ---------- | --------------------------------------------- |
| GET    | /version   | Get the service version                       |
| GET    | /boards    | Get the supported boards                      |
| GET    | /libraries | Get the installed libraries                   |
| POST   | /compile   | Compile the arduino code for a specific board |

### Example Compilation

#### Request

`POST http://localhost:8080/compile`

```json
{
	"board": "arduino:avr:uno",
	"sketch": "void setup(){} void loop(){}"
}
```

#### Response

```json
{
    "success": true,
    "hex": "OjEwMDAwMDAwMEM5NDM0MDAwQzk0NDYwMDBDOTQ0NjAwMEM5NDQ2MDA2QQ0KOjEwMDAxMDAwMEM5NDQ2MDAwQzk0NDYwMDBDOTQ0NjAwMEM5NDQ2MDA0OA0KOjEwMDAyMDAwMEM5NDQ2MDAwQzk0NDYwMDBDOTQ0NjAwMEM5NDQ2MDAzOA0KOjEwMDAzMDAwMEM5NDQ2MDAwQzk0NDYwMDBDOTQ0NjAwMEM5NDQ2MDAyOA0KOjEwMDA0MDAwMEM5NDQ4MDAwQzk0NDYwMDBDOTQ0NjAwMEM5NDQ2MDAxNg0KOjEwMDA1MDAwMEM5NDQ2MDAwQzk0NDYwMDBDOTQ0NjAwMEM5NDQ2MDAwOA0KOjEwMDA2MDAwMEM5NDQ2MDAwQzk0NDYwMDExMjQxRkJFQ0ZFRkQ4RTAzQw0KOjEwMDA3MDAwREVCRkNEQkYyMUUwQTBFMEIxRTAwMUMwMUQ5MkE5MzBGQw0KOjEwMDA4MDAwQjIwN0UxRjcwRTk0OTIwMDBDOTREQzAwMEM5NDAwMDA4Rg0KOjEwMDA5MDAwMUY5MjBGOTIwRkI2MEY5MjExMjQyRjkzM0Y5MzhGOTNCRA0KOjEwMDBBMDAwOUY5M0FGOTNCRjkzODA5MTA1MDE5MDkxMDYwMUEwOTExQQ0KOjEwMDBCMDAwMDcwMUIwOTEwODAxMzA5MTA0MDEyM0UwMjMwRjJEMzc4Rg0KOjEwMDBDMDAwMjBGNDAxOTZBMTFEQjExRDA1QzAyNkU4MjMwRjAyOTY1Qw0KOjEwMDBEMDAwQTExREIxMUQyMDkzMDQwMTgwOTMwNTAxOTA5MzA2MDE5OQ0KOjEwMDBFMDAwQTA5MzA3MDFCMDkzMDgwMTgwOTEwMDAxOTA5MTAxMDE1NA0KOjEwMDBGMDAwQTA5MTAyMDFCMDkxMDMwMTAxOTZBMTFEQjExRDgwOTM1MQ0KOjEwMDEwMDAwMDAwMTkwOTMwMTAxQTA5MzAyMDFCMDkzMDMwMUJGOTFGQw0KOjEwMDExMDAwQUY5MTlGOTE4RjkxM0Y5MTJGOTEwRjkwMEZCRTBGOTBCNA0KOjEwMDEyMDAwMUY5MDE4OTU3ODk0ODRCNTgyNjA4NEJEODRCNTgxNjBGMQ0KOjEwMDEzMDAwODRCRDg1QjU4MjYwODVCRDg1QjU4MTYwODVCRDgwOTFCMg0KOjEwMDE0MDAwNkUwMDgxNjA4MDkzNkUwMDEwOTI4MTAwODA5MTgxMDAyQQ0KOjEwMDE1MDAwODI2MDgwOTM4MTAwODA5MTgxMDA4MTYwODA5MzgxMDAyMg0KOjEwMDE2MDAwODA5MTgwMDA4MTYwODA5MzgwMDA4MDkxQjEwMDg0NjBFNA0KOjEwMDE3MDAwODA5M0IxMDA4MDkxQjAwMDgxNjA4MDkzQjAwMDgwOTE0NQ0KOjEwMDE4MDAwN0EwMDg0NjA4MDkzN0EwMDgwOTE3QTAwODI2MDgwOTMwNA0KOjEwMDE5MDAwN0EwMDgwOTE3QTAwODE2MDgwOTM3QTAwODA5MTdBMDA2MQ0KOjEwMDFBMDAwODA2ODgwOTM3QTAwMTA5MkMxMDBDMEUwRDBFMDIwOTc3MA0KOjBDMDFCMDAwRjFGMzBFOTQwMDAwRkJDRkY4OTRGRkNGOTkNCjowMDAwMDAwMUZGDQo=",
    "stdout": "Sketch uses 444 bytes (1%) of program storage space. Maximum is 32256 bytes.\nGlobal variables use 9 bytes (0%) of dynamic memory, leaving 2039 bytes for local variables. Maximum is 2048 bytes.\n",
    "stderr": ""
}
```

<br/>

## Notes

This project was forked from spaceneedle's [Chromeduino](https://github.com/spaceneedle/Chromeduino) project. 

### Notice of Non-Affiliation and Disclaimer:

We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with Arduino AG or Google LLC (“Google”), or any of their subsidiaries or their affiliates. The official Arduino AG website can be found at https://www.arduino.cc
The names "Chrome", "Chromebook", "Chromebox", "Arduino", and "Genuino" as well as related names, marks, emblems and images are registered trademarks of their respective owners.

