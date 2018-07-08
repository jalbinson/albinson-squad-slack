const { WebClient } = require('@slack/client');

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

export function processFiles(fn: (file) => void): void {
  processFilesHelper();

  function processFilesHelper(page = 1): void {
    const query = {
      channel: 'C141V6EAV', // #general
      ts_to: 1514764800, // 1/1/2018 UTC,
      page
    };

    web.files.list(query).then(({ files, paging: { page, pages, total } }) => {
      if (page === 1) {
        console.log(`processing ${total} files...`);
      }

      files.forEach((file) => {
        fn(file);
      });

      if (page < pages) {
        processFilesHelper(page + 1);
      }
    });
  }
}
