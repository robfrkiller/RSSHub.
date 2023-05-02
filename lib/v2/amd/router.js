module.exports = function (router) {
    router.get('/chipset/:platform/:lv1/:lv2', require('./chipset'));
    router.get('/graphics/:platform/:lv1/:lv2/:lv3', require('./graphics'));
};
