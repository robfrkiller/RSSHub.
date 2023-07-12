const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const uuid = ctx.params.uuid ?? '';

    if (!uuid) {
        throw Error('uuid invalid.');
    }

    const rootUrl = `https://join.gov.tw/idea/detail/${uuid}`;

    const response = await got({
        method: 'get',
        url: rootUrl,
    });

    const $ = cheerio.load(response.data);
    const ts = Date.now();

    ctx.state.data = {
        title: `${$('title').text().trim()} 附議數統計`,
        link: rootUrl,
        item: [
            {
                title: $('.detail-join-num').text().trim(),
                link: `${rootUrl}#t=${ts}`,
                pubDate: parseDate(ts),
            },
        ],
    };
};
