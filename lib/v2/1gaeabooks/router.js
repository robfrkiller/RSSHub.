module.exports = (router) => {
    router.get('/:author/:cname?', require('./index'));
};
