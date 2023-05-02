const got = require('@/utils/got');
const dayjs = require('dayjs');

module.exports = async (ctx) => {
    const platformList = {
        'win10-64': 'Windows 10 - 64 位元版',
    };
    const lv1 = ctx.params.lv1;
    const lv2 = ctx.params.lv2;
    const lv3 = ctx.params.lv3;
    const platform = platformList[ctx.params.platform];
    const url = `https://www.amd.com/zh-hant/support/graphics/${lv1}/${lv2}/${lv3}`;
    const response = await got({
        url,
        http2: true,
        headers: {
            'accept-language': 'zh-TW,zh;q=0.9',
        },
    });
    const changeLog = response.data.match(new RegExp(`${platform}<\\/summary>.+?Revision\\sNumber.*?([\\d\\.]+).+?datetime="([\\dTZ\\-:]+)"`, 's'));

    if (changeLog) {
        ctx.state.data = {
            title: 'AMD Graphics release',
            link: 'https://www.amd.com/',
            description: 'AMD Graphics release',
            item: [
                {
                    title: changeLog[1],
                    description: changeLog[1],
                    pubDate: dayjs(changeLog[2]).toString(),
                    link: `${url}?v=` + changeLog[1],
                },
            ],
        };
    }
};
