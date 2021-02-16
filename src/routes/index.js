'use strict';   // to enforce secure coding practices

const poem_routes = require('./poem');
const car_routes = require('./car');

// export a function to add/register routes for the app
module.exports = function (app) {
    poem_routes(app);
    car_routes(app);
};