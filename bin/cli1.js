#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const runCommand = (command, cwd) => {
    try {
        execSync(`${command}`, { stdio: 'inherit', cwd });
    } catch (e) {
        console.log('failed to exec ', e);
        return false;
    }
    return true;
}

const repoName = process.argv[2];
const folderName = process.argv[3];
const tempArchivePath = path.join(__dirname, 'temp_archive.tar.gz');
const gitRepoURL = 'https://github.com/rnarnware/testNpx'; // Replace with your repository URL
const gitArchiveCommand = `git archive --format=tar.gz --output=${tempArchivePath} HEAD ${`src/${folderName}`}`;
const extractCommand = `tar -xf ${tempArchivePath} -C .`;

if (!repoName || !folderName) {
    console.log('Usage: npx create-react-casper <repoName> <folderName>');
    process.exit(-1);
}

const gitCheckoutCommand = `git clone --depth 1 ${gitRepoURL} ${repoName}`;

console.log(`Cloning the repo with name ${repoName}`);
const checkOut = runCommand(gitCheckoutCommand);

if (!checkOut) process.exit(-1);

console.log(`Creating archive of ${folderName} in ${repoName}`);
const archiveCreated = runCommand(gitArchiveCommand, repoName);

if (!archiveCreated) process.exit(-1);

console.log(`Extracting ${folderName}`);
const extractionSuccess = runCommand(extractCommand);

if (!extractionSuccess) process.exit(-1);

console.log(`Installing dependencies for ${folderName}`);
const installDepsCommand = `cd ${folderName} && npm install`;
const installedDeps = runCommand(installDepsCommand);

if (!installedDeps) process.exit(-1);

console.log(`Cleaning up temporary files`);
fs.removeSync(tempArchivePath);

console.log(`Congrats! Happy hacking in ${folderName}`);
