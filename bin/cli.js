#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const runCommand = command => {
    try {
        execSync(`${command}`, { stdio: 'inherit'});
    } catch (e) {
        console.log('failed to exec ', e);
        return false;
    }
    return true;
}

const repoName = process.argv[2];
const folderName = process.argv[3];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/rnarnware/testNpx ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`Cloning the repo with name ${repoName}`);
const checkOut = runCommand(gitCheckoutCommand);

if (!checkOut) process.exit(-1);

console.log(`Installing dependencies for ${repoName}`);
const installedDeps = runCommand(installDepsCommand);

if (!installedDeps) process.exit(-1);

if (folderName) {
    console.log(`Copying specific folder: ${folderName}`);
    const sourcePath = path.join(__dirname, repoName, folderName);
    const destinationPath = path.join(process.cwd(), folderName);

    try {
        fs.copySync(sourcePath, destinationPath, { overwrite: true });
        console.log(`Copied ${folderName} to ${destinationPath}`);
        console.log(`Congrats! Happy hacking in ${folderName}`);
    } catch (err) {
        console.error('Error copying the folder:', err);
        process.exit(-1);
    }
} else {
    console.log(`Congrats! Happy hacking in ${repoName}`);
}
