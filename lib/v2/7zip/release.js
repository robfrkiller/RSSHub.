const got = require('@/utils/got');
const dayjs = require('dayjs');

module.exports = async (ctx) => {
    const response = await got.get('https://www.7-zip.org/history.txt');
    const changeLog = response.data.match(/(\d+\.\d+(?:\s\w+)?)\s+(20\d{2}-[01][0-9]-[0-3][0-9])/s);

    if (changeLog) {
        const desc = response.data.match(new RegExp(`${changeLog[1].replaceAll('.', '\\.')}\\s{10}${changeLog[2]}\r\n-{25}\r\n(.+?)\r\n\r\n\r\n`, 's'));
        ctx.state.data = {
            title: '7-Zip release',
            link: 'https://www.7-zip.org/',
            description: '7-Zip release',
            item: [
                {
                    title: changeLog[1],
                    description: desc[1],
                    pubDate: dayjs(changeLog[2]).toString(),
                    link: 'https://www.7-zip.org/?v=' + changeLog[1],
                },
            ],
        };
    }
};
