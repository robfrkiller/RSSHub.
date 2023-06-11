const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

// https://www.ecpay.com.tw/Announcement/MoreAnnouncement

module.exports = async (ctx) => {
    const rootUrl = 'https://www.ecpay.com.tw/Announcement/MoreAnnouncement';

    const response = await got(rootUrl);

    const $ = cheerio.load(response.data);

    const list = $('#divAnnouncement table.list tbody tr')
        .filter((_, item) => $(item).find('.maintain').length === 0)
        .map((_, item) => {
            const $item = $(item);

            return {
                title: $item.find('.news_list').text().trim(),
                link: 'https://www.ecpay.com.tw' + $item.find('.news_list a').attr('href'),
                pubDate: parseDate($item.find('.align_c').text().trim()),
            };
        })
        .get();

    ctx.state.data = {
        title: $('title').text().trim(),
        link: rootUrl,
        item: list,
    };
};
