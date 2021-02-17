'use strict';   // to enforce secure coding practices

const axios = require('axios');
const cheerio = require('cheerio');
const constants = require('../constants');

const crawl_thiviennet = async (url) => {
    try {
        const encoded_url = encodeURI(url);
        const { data: html } = await axios.get(encoded_url);
        const $ = await cheerio.load(html);

        let poems = [];
        const poem_links = $('div.poem-group-list a');
        poem_links.each(async (index, el) => {
            debugger
            const el_url = constants.SITES.THIVIEN + el.attribs.href;
            const poem = await get_poem(el_url);
            poems.push(poem);
        });

        return poems;
    } catch (error) {
        throw error;
    }
};

const get_poem = async (url) => {
    let content = '';
    let title = ''; // TODO
    try {
        const { data: html } = await axios.get(url);
        const $ = await cheerio.load(html);
        content = $('div.poem-content p:nth-child(1)').html();
    } catch (error) {
        console.log('get_poem_content', error);
    }
    return { title, content };
};

module.exports = {
    crawl_thiviennet
};