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
const filesToCopy = process.argv[3] ? process.argv[3].split(',') : []; // User can provide comma-separated folder names
const gitCheckoutCommand = `git clone --depth 1 https://github.com/rnarnware/testNpx ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`Cloning the repo with name ${repoName}`);
const checkout = runCommand(gitCheckoutCommand);

if (!checkout) {
    console.log('Failed to clone the repository');
    process.exit(-1);
}

console.log('Installing dependencies for ', repoName);
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) {
    console.log('Failed to install dependencies');
    process.exit(-1);
}

if (filesToCopy.length > 0) {
    console.log('Copying specific files/folders');
    filesToCopy.forEach(folder => {
        const sourcePath = path.join(__dirname, `src/${folder}`);
        const destinationPath = path.join(__dirname, repoName, folder);
        console.log(sourcePath, "sourcePath");
        console.log(destinationPath, "destinationPath");
        if (fs.existsSync(sourcePath)) {
            try {
                fs.copyFileSync(sourcePath, destinationPath);
                console.log(`Copied ${folder} to ${repoName}`);
            } catch (err) {
                console.error(`Error copying ${folder}:`, err);
            }
        } else {
            console.error(`Folder ${folder} does not exist in the template`);
        }
    });
} else {
    console.log('Copying the entire template repository');
    const sourcePath = path.join(__dirname); // Include '..' to go up one level from the current directory
    const destinationPath = path.join(__dirname, repoName);

    try {
        fs.mkdirSync(destinationPath);
        fs.copySync(sourcePath, destinationPath, { overwrite: true });
        console.log(`Copied entire template repository to ${repoName}`);
    } catch (err) {
        console.error('Error copying the template repository:', err);
    }
}

console.log(`Congrats! Happy hacking`);