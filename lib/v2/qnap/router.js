module.exports = function (router) {
    router.get('/download/:model_id/:type', require('./qts'));
};
