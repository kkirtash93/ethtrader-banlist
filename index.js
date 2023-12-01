import snoowrap from "snoowrap";
import dotenv from 'dotenv';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const folderPath = path.join(__dirname, '/in');
const fileName = 'banList.json';
const fullPath = `${folderPath}/${fileName}`
const communityName = 'kirtash93';

dotenv.config();

const credentials = {
  userAgent: 'Get Banned User List 1.0 by u/kirtash93',
  clientId: process.env.REDDIT_SCRIPT_CLIENT_ID,
  clientSecret: process.env.REDDIT_SCRIPT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
};

const reddit = new snoowrap(credentials);
const banList = await reddit.getSubreddit(communityName).getBannedUsers({ limit: Infinity });

async function main() {
  try {
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      fs.writeFileSync(fullPath, JSON.stringify(banList, null, 2));
    } else {
      await updateFile();
    }
  } catch (error) {
    console.error('Main Error:', error);
  }
}

async function updateFile() {
  try {
    const data = await fs.readFileSync(fullPath, { encoding: 'utf8' });
    const recordedBanList = JSON.parse(data);

    banList.forEach(bannedUser => {
      const idExists = recordedBanList.some(recordedBannedUser => recordedBannedUser.id === bannedUser.id);

      if (!idExists) {
        recordedBanList.push(bannedUser);
      }
    });

    await fs.writeFileSync(fullPath, JSON.stringify(recordedBanList, null, 2));
  } catch (error) {
    console.error(`Error updating file ${fullPath}:`, error);
  }
}

main();
