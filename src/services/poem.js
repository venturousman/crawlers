'use strict';   // to enforce secure coding practices

const axios = require('axios');
const cheerio = require('cheerio');
const Crawler = require("crawler");
const constants = require('../constants');

// https://github.com/bda-research/node-crawler/issues/259
const crawl_thiviennet_async = async () => {
    const poems = [];
    const c = new Crawler({ maxConnections: 1, rateLimit: 3000 });

    function crawlerPromise(options) {
        return new Promise((resolve, reject) => {
            options.callback = (err, res, done) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
                done();
            }
            c.queue(options);
        });
    }

    try {
        const res = await crawlerPromise({ uri: 'https://www.thivien.net/searchauthor.php?Page=1' });
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
        const author_tags = res.$('div.list-item h4.list-item-header a');
        const promises = author_tags
            .map(async (index, el) => {
                const author = res.$(el).text();
                const res1 = await crawlerPromise({ uri: `${res.request.uri.protocol}//${res.request.host}${el.attribs.href}` });
                const poem_tags = res1.$('div.poem-group-list a');
                const promises1 = poem_tags
                    .map(async (index, el) => {
                        const title = res1.$(el).text();
                        const res2 = await crawlerPromise({ uri: `${res1.request.uri.protocol}//${res1.request.host}${el.attribs.href}` });
                        const content = res2.$('div.poem-content p:nth-child(1)').html();
                        poems.push({ author, title, content });
                    })
                    .toArray();
                await Promise.all(promises1);
            })
            .toArray();
        await Promise.all(promises);
    } catch (error) {
        console.log(error);
    }

    // crawlerPromise({ uri: 'https://www.thivien.net/searchauthor.php?Page=1' })
    //     .then((res) => {
    //         const $ = res.$;
    //         // $ is Cheerio by default
    //         //a lean implementation of core jQuery designed specifically for the server
    //         const author_tags = $('div.list-item h4.list-item-header a');
    //         author_tags.each((index, el) => {
    //             const author = $(el).text();
    //             crawlerPromise({ uri: `${res.request.uri.protocol}//${res.request.host}${el.attribs.href}` })
    //                 .then((res) => {
    //                     const $ = res.$;
    //                     const poem_tags = $('div.poem-group-list a');
    //                     poem_tags.each((index, el) => {
    //                         const title = $(el).text();
    //                         crawlerPromise({ uri: `${res.request.uri.protocol}//${res.request.host}${el.attribs.href}` })
    //                             .then((res) => {
    //                                 const $ = res.$;
    //                                 const content = $('div.poem-content p:nth-child(1)').html();
    //                                 poems.push({ author, title, content });
    //                             })
    //                             .catch((error) => { console.log(error); })
    //                     });
    //                 })
    //                 .catch((error) => { console.log(error); })
    //         });
    //     })
    //     .catch((error) => { console.log(error); });
    return poems;
};

const crawl_thiviennet = () => {
    const poems = [];
    const c = new Crawler({
        maxConnections: 1,
        rateLimit: 3000,    // in milliseconds
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
};

module.exports = {
    crawl_thiviennet,
    crawl_thiviennet_async
};