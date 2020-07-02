const express = require('express');
const Joi = require('@hapi/joi');
const morgan = require('morgan');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
// app.use(addAllowOriginHeader);
// app.options('*', addCorsHeaders);
// app.use(cors({ origin: "http://localhost:3000" }))
app.use(cors());

const PORT = process.env.PORT || 3007;
// console.log(process.env.KEY);
app.get('/', (req, res) => {
    res.send('Hello from API on Heroku!')
});


app.post('/weather',validateWeatherQueryParams, getWeather);

function validateWeatherQueryParams(req, res, next) {
    const schema = Joi.object({
        city: Joi.string().required()
    })
    const result = schema.validate(req.body)

    if (result.error) {
        res.status(400).json({ "message": "missing required name field" });
    }
    next();
}

async function getWeather(req, res) {
    const { city } = req.body;

    const respons = await fetch(`http://api.weatherstack.com/current?access_key=${process.env.KEY}&query=${city}`);
    const responsPars = await respons.json();

    if (responsPars.error) {
        res.status(responsPars.code).send(responsPars.error.message);
    }
    res.send(responsPars);
}

function addAllowOriginHeader(req, res, next) {
	res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	next();
}

function addCorsHeaders(req, res, next) {
	res.set('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
	res.set('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);

	res.status(200).send();
}

app.listen(PORT,() => {
    console.log('Example app listening on port ' + PORT);
});
