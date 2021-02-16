'use strict';   // to enforce secure coding practices

const poem_service = require('../services/poem');
const constants = require('../constants');

// crawl poems from specified site, i.e. https://www.thivien.net/
const crawl = async (req, res, next) => {
    try {
        const { query: { url } } = req;
        if (!url) {
            throw new Error('The "url" parameter is required!')
        }
        let result = '';
        if (url.includes(constants.SITES.THIVIEN)) {
            result = await poem_service.crawl_thiviennet(url);
        }
        return res.json(result).status(200);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    crawl
};