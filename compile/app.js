const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const config = require('./config.json');
const port = process.env.PORT || config.port;
const { name , version } = require('./package.json');
const arduino_dir = __dirname + "/arduino-1.8.5";
const arduino = new (require("./arduino.js"))(arduino_dir);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", ["X-Requested-With", "content-type"]);
    next();
});

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));

app.set("trust proxy", 1); // trust first proxy

app.get('/version', (req, res) => res.json({name, version}));

app.get('/boards', (req, res) => res.json(arduino.boards));

app.get('/libraries', (req, res) => res.json(arduino.libraries));

app.post('/compile', (req, res) => {
    if(typeof req.body.sketch !== 'string' || typeof req.body.board !== 'string')
        return res.json({success: false, msg: "invalid parameters passed"});
    arduino.compile(req.body.sketch, req.body.board).catch(console.error).then(data=>res.json(data));
});

app.get('*', (req, res) => res.status(404).send("Not found"));

app.listen(port, () => console.log(`Compile service listening on port ${port}!`));
