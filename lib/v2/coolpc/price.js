const cheerio = require('cheerio');
const got = require('@/utils/got');
const iconv = require('iconv-lite');
const md5 = require('@/utils/md5');
const { execSync } = require('node:child_process');
const Diff2html = require('diff2html');
const fs = require('fs');

function getVersion(cachedString) {
    if (!cachedString) {
        return [];
    }

    return cachedString.split('||');
}

// new||old||time
function setVersion(cachedArray) {
    return cachedArray.join('||');
}

module.exports = async (ctx) => {
    const link = 'https://coolpc.com.tw/m/m-list.php';
    const response = await got({
        responseType: 'buffer',
        method: 'post',
        url: link,
        form: {
            G: ctx.params.id,
        },
    });

    const $ = cheerio.load(iconv.decode(response.data, 'big5'));

    const items = $('.Q table tbody tr')
        .map((_, tr) => $(tr).text())
        .toArray()
        .sort();

    const newString = JSON.stringify(items, null, 4);

    const newMD5 = md5(newString);
    const newVersionPath = `${__dirname}/versions/${ctx.params.id}_${newMD5}.json`;
    fs.writeFileSync(newVersionPath, newString);

    const latestMD5Key = `coolpcVersion:${ctx.params.id}:latest`;
    let [latestMD5, oldMd5, uptime] = getVersion(await ctx.cache.get(latestMD5Key));

    if (!latestMD5 || latestMD5 !== newMD5) {
        uptime = Date.now();
        await ctx.cache.set(latestMD5Key, setVersion([newMD5, latestMD5, uptime]), 86400 * 7);

        oldMd5 = latestMD5;
        latestMD5 = newMD5;
    }

    let diffContent = '';
    if (oldMd5) {
        const oldVersionPath = `${__dirname}/versions/${ctx.params.id}_${oldMd5}.json`;

        if (fs.existsSync(newVersionPath) && fs.existsSync(oldVersionPath)) {
            const cmd = `/usr/bin/diff -u0 ${oldVersionPath} ${newVersionPath}`;

            try {
                execSync(cmd);
            } catch (e) {
                const diffJson = Diff2html.parse(e.stdout.toString());
                diffContent = Diff2html.html(diffJson, { drawFileList: false });
            }
        }
    }

    ctx.state.data = {
        title: `原價屋 - ${$('title').text()}`,
        link,
        item: [
            {
                title: `版本: ${latestMD5}`,
                description: diffContent,
                pubDate: new Date(parseInt(uptime)).toUTCString(),
                link: `${link}?G=${ctx.params.id}&aaaa=${latestMD5}`,
            },
        ],
    };
};
