import { processFiles } from './files';
const https = require('https');
const fs = require('fs');
const url = require('url');
const token = process.env.SLACK_TOKEN;

if (!fs.existsSync('downloads')) {
  fs.mkdirSync('downloads');
}

processFiles(({ timestamp, id, filetype, url_private }) => {
  const { host, path } = url.parse(url_private);
  const options = {
    host,
    path,
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const fileName = `${timestamp}-${id}.${filetype}`;
  const file = fs.createWriteStream(`downloads/${fileName}`);
  https.get(options, (response) => {
    const stream = response.pipe(file);
    stream.on('finish', () => {
      console.log(fileName);
    });
  });
});
