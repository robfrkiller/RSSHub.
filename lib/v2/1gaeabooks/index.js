const got = require('@/utils/got');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const author = ctx.params.author;
    const cname = ctx.params.cname;

    const currentUrl = `https://api.gaeabooks.com.tw/api/goods?sort_by=published_at&descending=1&page=1&rows_per_page=5&sec_type[]=${author}`;
    const response = await got(currentUrl);

    ctx.state.data = {
        title: `${response.data.data.data[0].author[0].nickname} ${cname || '全部'} - 蓋亞讀樂網`,
        link: `https://www.gaeabooks.com.tw/goods-list?sec_type=${author}`,
        item: response.data.data.data
            .filter((item) => !cname || item.name.includes(cname))
            .map((item) => ({
                title: item.name,
                link: `https://www.gaeabooks.com.tw/goods/${item.id}`,
                author: item.author[0].nickname,
                description: `<img src="${item.cover}" />`,
                pubDate: parseDate(item.published_at),
            })),
    };
};
