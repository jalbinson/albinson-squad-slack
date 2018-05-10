const https = require('https');
const fs = require('fs');
const { WebClient } = require('@slack/client');

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

if (!fs.existsSync('downloads')) {
  fs.mkdirSync('downloads');
}

downloadFiles();

function downloadFiles(page = 1): void {
  const query = {
    channel: 'C141V6EAV', // #general
    ts_to: 1514764800, // 1/1/2018 GMT,
    page
  };

  web.files.list(query).then(({ files, paging }) => {
    const { page, pages, total } = paging;
    if (page === 1) {
      console.log(`downloading ${total} files...`);
    }
    files.forEach((fileData) => {
      const options = {
        host: 'files.slack.com',
        path: fileData.url_private.replace('https://files.slack.com', ''),
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const fileName = `${fileData.id}.${fileData.filetype}`;
      const file = fs.createWriteStream(`downloads/${fileName}`);
      https.get(options, (response) => {
        const stream = response.pipe(file);
        stream.on('finish', () => {
          console.log(fileName);
        });
      });
    });
    
    if (page < pages) {
      downloadFiles(page + 1);
    }
  });
}