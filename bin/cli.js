#!/usr/bin/env node
const { execSync } = require('child_process');
const { inherits } = require('util');

const runCommand = command => {
    try {
        execSync(`${command}`, { stdio: 'inherit'});
    }catch(e){
        console.log('failed to exec ', e);
        return false;
    }
    return true;
}

const repoName = process.argv[2];
const giCheckoutCommand = `git clone --depth 1 https://github.com/rnarnware/testNpx ${repoName}`
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`cloning the repo with name ${repoName}`);
const checkOut = runCommand(giCheckoutCommand);

if(!checkOut) process.exit(-1);

console.log('insallling dependnecies for ', repoName);
const installedlDeps = runCommand(installDepsCommand)
if(!installedlDeps) process.exit(-1);
console.log(`congrats happy hacking`);