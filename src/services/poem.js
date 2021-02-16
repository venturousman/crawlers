'use strict';   // to enforce secure coding practices

const axios = require('axios');
const cheerio = require('cheerio');

const crawl_thiviennet = async (url) => {
    try {
        const encodedUrl = encodeURI(url);
        const { data: html } = await axios.get(encodedUrl);
        const $ = await cheerio.load(html);

        return html;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    crawl_thiviennet
};