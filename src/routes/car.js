'use strict';   // to enforce secure coding practices

// export a function to add/register routes for the app
module.exports = function (app) {
    app.get('/car', (req, res, next) => {
        return res.json('Car!').status(200);
    });
};