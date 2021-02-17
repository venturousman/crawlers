'use strict';   // to enforce secure coding practices

const { query } = require('express-validator');
const poem_controller = require('../controllers/poem');

// export a function to add/register routes for the app
module.exports = function (app) {
    app.get('/poem', (req, res, next) => {
        return res.json('Poem!').status(200);
    });

    // crawl poems from specified site, i.e. https://www.thivien.net/
    app.get(
        '/poem/crawl',
        [
            //check('url').exists().withMessage("The 'url' parameter is required!"),
            query('url', "The 'url' parameter is required!").exists(),
        ],
        poem_controller.crawl
    );
};