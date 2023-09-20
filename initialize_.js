const fs = require('fs');
const path = require('path');
const readline = require('readline');
const childProcess = require('child_process'); // Add this line to import childProcess

// Function to create a directory if it doesn't exist
function createDirectoryIfNotExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
}

// Function to copy a file if it doesn't exist in the destination
function copyFileIfNotExists(sourcePath, destinationPath) {
  if (!fs.existsSync(destinationPath)) {
    fs.copyFileSync(sourcePath, destinationPath);
  }
}

// Create a ./tmp folder in the root directory
const tmpDir = path.join(__dirname, 'backend', 'tmp');
createDirectoryIfNotExists(tmpDir);

// Define a menu
const menu = `
Select an option:
1. Local
2. MongoDB
3. Exit
`;

// Display the menu
console.log(menu);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to handle user input
function handleUserInput(input) {
  switch (input) {
    case '1':
      console.log('Initializing local database...');
      break;
    case '2':
      console.log('Initializing MongoDB...');
      break;
    case '3':
      rl.close(); // Close the readline interface to exit the program
      break;
    default:
      console.log('Invalid selection. Please choose a valid option.');
      break;
  }
  
  // Display the menu again
  console.log(menu);
}

rl.question('Enter your choice (1, 2, or 3): ', (choice) => {
  handleUserInput(choice);
  rl.close();
});

// Copy the ./backend/database.json file to ./backend/tmp/db.json
const dbFile = path.join(__dirname, 'backend', 'init', 'database.json');
const tmpDbFile = path.join(__dirname, 'backend', 'tmp', 'db.json');
copyFileIfNotExists(dbFile, tmpDbFile);

// Run npm install in the ./frontend folder
const frontendDir = path.join(__dirname, 'frontend');
childProcess.execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

// Run npm install in the ./backend folder
const backendDir = path.join(__dirname, 'backend');
childProcess.execSync('npm install', { cwd: backendDir, stdio: 'inherit' });

// Create .env file in the ./backend folder
const envFile = path.join(__dirname, 'backend', '.env');

if (!fs.existsSync(envFile)) {
  rl.question('Enter your OpenAI API key: ', (key) => {
    const envContent = `OPEN_AI_API_KEY=${key}`;
    fs.writeFileSync(envFile, envContent);
    rl.close();
  });
}

// Display instructions to run the app
console.log('To start the app, run the following commands:');
console.log('1. docker-compose build');
console.log('2. docker-compose up');
