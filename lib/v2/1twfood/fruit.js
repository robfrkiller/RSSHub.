const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const ftype = ctx.params.type;
    const fruit = ctx.params.fruit;

    const link = `https://www.twfood.cc/fruit/${ftype}/${fruit}`;
    const { data } = await got.get(link);
    const $ = cheerio.load(data);
    const trText = $('#vege_chart div.vege_price > table > tbody > tr')
        .filter((index) => index <= 5)
        .map((_, ele) => $(ele).text())
        .get();

    if (trText.length < 6) {
        throw Error('trText.length < 6!!');
    }

    const now = Date.now();

    ctx.state.data = {
        title: $('title').text(),
        link,
        item: [
            {
                title: `${fruit}: ${trText[0]}${trText[1]}${trText[2]} | ${trText[3]}${trText[4]}${trText[5]}`.trim(),
                pubDate: parseDate(now),
                link: `${link}#${now}`,
            },
        ],
    };
};
