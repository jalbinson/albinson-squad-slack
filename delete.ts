import { processFiles } from './files';
import { WebClient } from "@slack/client";

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

processFiles(({ id }) => {
  web.files.delete({ file: id }).then(() => {
    console.log(`deleted: ${id}`);
  });
});
