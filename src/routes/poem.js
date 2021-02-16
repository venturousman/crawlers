'use strict';   // to enforce secure coding practices

// const userSchema = require('../../schemas/user');
// const validator = require('../middlewares/validator');
// const { update, sendCode } = require('../actions/user');
const poem_controller = require('../controllers/poem');

// export a function to add/register routes for the app
module.exports = function (app) {
    // app.patch('/users/:id', validator(userSchema), update);
    // app.post('/send', validator(verificationSchema), sendCode);
    app.get('/poem', (req, res, next) => {
        return res.json('Poem!').status(200);
    });
    
    // crawl poems from specified site, i.e. https://www.thivien.net/
    app.get('/poem/crawl', poem_controller.crawl);
};