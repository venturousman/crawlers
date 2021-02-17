'use strict';   // to enforce secure coding practices

const car_controller = require('../controllers/car');

// export a function to add/register routes for the app
module.exports = function (app) {
    app.get('/car', (req, res, next) => {
        return res.json('Car!').status(200);
    });

    app.get('/car/hello', car_controller.hello);
};