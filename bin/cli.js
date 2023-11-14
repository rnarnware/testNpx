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
const folderNames = process.argv[3].split(',').map(folder => folder.trim()); // Split folder names by comma
const gitCheckoutCommand = `git clone --depth 1 https://github.com/rnarnware/testNpx ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`Cloning the repo with name ${repoName}`);
const checkOut = runCommand(gitCheckoutCommand);

if (!checkOut) process.exit(-1);

console.log(`Installing dependencies for ${repoName}`);
const installedDeps = runCommand(installDepsCommand);

if (!installedDeps) process.exit(-1);

if (folderNames.length > 0) {
    console.log(`Copying specific folders: ${folderNames.join(', ')}`);
    
    folderNames.forEach(folderName => {
        const sourcePath = path.join(process.cwd(), repoName, 'src', folderName);
        const destinationPath = path.join(process.cwd(), folderName);

        try {
            fs.copySync(sourcePath, destinationPath, { overwrite: true });
            console.log(`Copied ${folderName} to ${destinationPath}`);
        } catch (err) {
            console.error(`Error copying the folder ${folderName}:`, err);
        } // Delete the cloned repository after copying the folder
        fs.removeSync(repoName);
        // console.log(`Deleted the cloned repository: ${repoName}`);
    });

    console.log(`successfully cloned ${folderNames.join(', ')}`);
} else {
    console.log(`Congrats! Happy hacking in ${repoName}`);
}
