'use strict';   // to enforce secure coding practices

const hello = async (req, res, next) => {
    try {
        const result = 'Hello world!';
        return res.json(result).status(200);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    hello
};