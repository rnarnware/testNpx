#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const runCommand = (command) => {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (e) {
        console.log('failed to exec ', e);
        return false;
    }
    return true;
}

const repoName = process.argv[2];
const folderName = process.argv[3];

if (!repoName || !folderName) {
    console.log('Usage: npx create-react-casper <repoName> <folderName>');
    process.exit(-1);
}

const gitRepoURL = 'https://github.com/rnarnware/testNpx';
const repoPath = path.join(__dirname, repoName);
const folderPath = path.join(repoPath, folderName);
const gitCheckoutCommand = `git clone --depth 1 --filter=blob:none --no-checkout ${gitRepoURL} ${repoName}`;
const gitSparseCheckoutCommand = `git -C ${repoPath} sparse-checkout set ${folderName}`;
const installDepsCommand = `npm install --prefix ${repoPath}`;

console.log(`Cloning the repo with name ${repoName}`);
const checkout = runCommand(gitCheckoutCommand);

if (!checkout) {
    console.log('Failed to clone the repository');
    process.exit(-1);
}

console.log('Creating the folder structure');
fs.ensureDirSync(repoPath);

console.log('Installing all dependencies for ', repoName);
const installedDeps = runCommand(installDepsCommand);

if (!installedDeps) {
    console.log('Failed to install dependencies');
    process.exit(-1);
}

console.log(`Checking out the specific folder: ${folderName}`);
const sparseCheckout = runCommand(gitSparseCheckoutCommand);

if (!sparseCheckout) {
    console.log(`Failed to checkout the specific folder: ${folderName}`);
    process.exit(-1);
}

console.log(`List of files in ${repoPath}:`);
const fileList = fs.readdirSync(repoPath);
console.log(fileList);

console.log(`Congrats! Happy hacking`);
