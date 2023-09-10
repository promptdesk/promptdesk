//create a ./tmp folder in the root directory

const fs = require('fs');
const path = require('path');

const tmpDir = path.join(__dirname, 'backend', 'tmp');

if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
}

//copy the ./backend/database.json file to ./backend/tmp/db.json
const dbFile = path.join(__dirname, 'backend', 'init', 'database.json');
const tmpDbFile = path.join(__dirname, 'backend', 'tmp', 'db.json');

fs.copyFileSync(dbFile, tmpDbFile);

//run npm install in the ./frontend folder
const frontendDir = path.join(__dirname, 'frontend');
const childProcess = require('child_process');
childProcess.execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

//run npm install in the ./backend folder
const backendDir = path.join(__dirname, 'backend');
childProcess.execSync('npm install', { cwd: backendDir, stdio: 'inherit' });

//create .env file in the ./backend folder
const envFile = path.join(__dirname, 'backend', '.env');

//get user input for OPEN_AI_API_KEY
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Enter your OpenAI API key: ', (key) => {
    const envContent = `OPEN_AI_API_KEY=${key}`;
    fs.writeFileSync(envFile, envContent);
    readline.close();
});


//display the instructions to run the app: docker compose build && docker compose up

console.log('Please run the following command to start the app:');
console.log('docker compose build && docker compose up');
