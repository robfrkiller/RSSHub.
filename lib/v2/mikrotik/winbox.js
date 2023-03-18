const got = require('@/utils/got');
const dayjs = require('dayjs');

module.exports = async (ctx) => {
    const response = await got.get('https://mikrotik.com/download');
    const changeLog = response.data.match(/WinBox\s[\d.]+/);

    if (changeLog) {
        ctx.state.data = {
            title: 'WinBox release',
            link: 'https://mikrotik.com/download',
            description: 'WinBox release',
            item: [
                {
                    title: changeLog[0],
                    description: changeLog[0],
                    pubDate: dayjs().toString(),
                    link: 'https://mikrotik.com/download?v=' + changeLog[0],
                },
            ],
        };
    }
};
