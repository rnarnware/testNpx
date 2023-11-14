#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const runCommand = command => {
    try {
        execSync(`${command}`, { stdio: 'inherit' });
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
const gitSparseCheckoutCommand = `cd ${repoName} && git sparse-checkout set ${folderName}`;
const installDepsCommand = `cd ${repoName} && npm install`;
const installFolderDepsCommand = `cd ${folderPath} && npm install`;

console.log(`Cloning the repo with name ${repoName}`);
const checkout = runCommand(gitCheckoutCommand);

if (!checkout) {
    console.log('Failed to clone the repository');
    process.exit(-1);
}

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

console.log(`Installing dependencies for the specified folder: ${folderName}`);
const installedFolderDeps = runCommand(installFolderDepsCommand);

if (!installedFolderDeps) {
    console.log(`Failed to install dependencies for ${folderName}`);
    process.exit(-1);
}

console.log(`Congrats! Happy hacking`);
