const got = require('@/utils/got');

// https://www.yamaha-motor.com.tw/news/news

module.exports = async (ctx) => {
    const response = await got.post('https://www.yamaha-motor.com.tw/api/news_list.ashx', {
        form: {
            type: 'news',
            page: 1,
        },
    });

    const list = response.data.data.map((item) => ({
        title: item.mainTitle,
        description: item.Content,
        link: `https://www.yamaha-motor.com.tw/news/${item.URL}`,
        pubDate: item.IssueDate,
    }));

    ctx.state.data = {
        title: '消息中心 | YAMAHA 台灣山葉機車',
        link: 'https://www.yamaha-motor.com.tw/news/news',
        item: list,
    };
};
