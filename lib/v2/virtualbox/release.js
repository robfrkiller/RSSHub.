const got = require('@/utils/got');
const dayjs = require('dayjs');

module.exports = async (ctx) => {
    const response = await got.get('https://www.virtualbox.org/wiki/Changelog');
    const changeLog = response.data.match(/<strong>(VirtualBox\s[\d.]+)<\/strong>\s\(released\s([\s\w]+)\)<br/s);

    if (changeLog) {
        const desc = response.data.match(new RegExp(`${changeLog[1].replaceAll('.', '\\.')}.+?</p>\n(.+?)<p>\n\\s\n`, 's'));
        ctx.state.data = {
            title: 'VirtualBox release',
            link: 'https://www.virtualbox.org/',
            description: 'VirtualBox release',
            item: [
                {
                    title: changeLog[1],
                    description: desc[1],
                    pubDate: dayjs(changeLog[2]).toString(),
                    link: 'https://www.virtualbox.org/wiki/Downloads?v=' + changeLog[1],
                },
            ],
        };
    }
};
