import snoowrap from "snoowrap";
import dotenv from 'dotenv';
import fs from "fs/promises"; // Use fs/promises for promise-based fs operations
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileName = path.join(__dirname, 'in/banList.json');
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
    if (!await fileExists(fileName)) {
      await fs.writeFile(fileName, JSON.stringify(banList, null, 2));
    } else {
      await updateFile();
    }
  } catch (error) {
    console.error('Main Error:', error);
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (err) {
    return false;
  }
}

async function updateFile() {
  try {
    const data = await fs.readFile(fileName, 'utf8');
    const recordedBanList = JSON.parse(data);

    banList.forEach(bannedUser => {
      const idExists = recordedBanList.some(recordedBannedUser => recordedBannedUser.id === bannedUser.id);

      if (!idExists) {
        recordedBanList.push(bannedUser);
      }
    });

    await fs.writeFile(fileName, JSON.stringify(recordedBanList, null, 2));
  } catch (error) {
    console.error(`Error updating file ${fileName}:`, error);
  }
}

main();
