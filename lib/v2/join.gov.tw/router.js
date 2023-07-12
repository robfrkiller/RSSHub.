module.exports = function (router) {
    router.get('/endorse/:uuid', require('./endorse'));
};
