module.exports = (router) => {
    router.get('/:type/:fruit', require('./fruit'));
};
