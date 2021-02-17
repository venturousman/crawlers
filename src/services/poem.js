'use strict';   // to enforce secure coding practices

const axios = require('axios');
const cheerio = require('cheerio');
const Crawler = require("crawler");
const constants = require('../constants');

const crawl_thiviennet = () => {
    try {
        const poems = [];
        const c = new Crawler({
            maxConnections: 1,
            rateLimit: 2000,    // in milliseconds
            // This will be called for each crawled page
            callback: function (error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    const $ = res.$;
                    // $ is Cheerio by default
                    //a lean implementation of core jQuery designed specifically for the server
                    const author_tags = $('div.list-item h4.list-item-header a');
                    const author_links = author_tags
                        .map((index, el) => {
                            const author = $(el).text();
                            return {
                                uri: `${res.request.uri.protocol}//${res.request.host}${el.attribs.href}`,
                                callback: function (error, res, done1) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        const $ = res.$;
                                        const poem_tags = $('div.poem-group-list a');
                                        const poem_links = poem_tags
                                            .map((index, el) => {
                                                const title = $(el).text();
                                                return {
                                                    uri: `${res.request.uri.protocol}//${res.request.host}${el.attribs.href}`,
                                                    callback: function (error, res, done2) {
                                                        if (error) {
                                                            console.log(error);
                                                        } else {
                                                            const $ = res.$;
                                                            const content = $('div.poem-content p:nth-child(1)').html();
                                                            poems.push({ author, title, content });
                                                        }
                                                        done2();
                                                    }
                                                };
                                            })
                                            .toArray();
                                        c.queue(poem_links);
                                    }
                                    done1();
                                }
                            }
                        })
                        .toArray();
                    c.queue(author_links);
                }
                done();
            }
        });

        c.queue('https://www.thivien.net/searchauthor.php?Page=1');

        c.on('drain', function () {
            console.log('crawling is done');
            console.log(poems);
        });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    crawl_thiviennet,
};