const got = require('@/utils/got');

module.exports = async (ctx) => {
    const response = await got.get('https://www.qnap.com/api/v1/download/files?locale_set=zh-tw&model_id=' + ctx.params.model_id, {
        headers: {
            referer: 'https://www.qnap.com/zh-tw/download',
        },
    });

    const jsonObject = JSON.parse(response.body);
    const items = [];
    const cc = jsonObject.downloads[ctx.params.type];
    for (const i in cc) {
        items.push({
            title: cc[i].name + '-' + cc[i].version,
            description: cc[i].releasenote.replace(/\n/g, '<br />\n'),
            pubDate: cc[i].published_at,
            link: cc[i].category,
        });
    }

    ctx.state.data = {
        title: 'QTS release',
        description: 'QTS release',
        link: 'https://www.qnap.com/zh-tw/download?model=ts-451&category=' + ctx.params.type,
        item: items,
    };
};
