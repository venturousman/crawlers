'use strict';   // to enforce secure coding practices

// https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/
const { validationResult } = require('express-validator');
const poem_service = require('../services/poem');
const constants = require('../constants');

// crawl poems from specified site, i.e. https://www.thivien.net/
const crawl = async (req, res, next) => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        const { query: { site } } = req;
        let poems = [];

        switch (site) {
            case constants.SITES.THIVIEN:
                // poem_service.crawl_thiviennet();
                poems = await poem_service.crawl_thiviennet_async();
                break;
            default:
                break;
        }
        // return res.status(200);
        return res.status(200).json(poems);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    crawl,
};