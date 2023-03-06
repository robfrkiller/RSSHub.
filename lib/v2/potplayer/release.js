const got = require('@/utils/got');
const dayjs = require('dayjs');

module.exports = async (ctx) => {
    const response = await got.get('https://t1.daumcdn.net/potplayer/PotPlayer/v4/Update2/UpdateCht.html');
    const versionNum = response.data.match(/^\[(\d+)\]$/m);

    if (versionNum) {
        const changeLog = response.data.match(new RegExp(`\\[${versionNum[1]}\\]\r\n-{10,}\r\n(.+?)\r\n\r\n-{10,}`, 's'));

        if (changeLog) {
            ctx.state.data = {
                title: 'PotPlayer release',
                link: 'https://potplayer.daum.net/?lang=zh_TW',
                description: 'PotPlayer release',
                item: [
                    {
                        title: versionNum[1],
                        description: changeLog[1],
                        pubDate: dayjs(versionNum[1], 'YYMMDD').toString(),
                        link: 'https://potplayer.daum.net/?lang=zh_TW',
                    },
                ],
            };
        }
    }
};
