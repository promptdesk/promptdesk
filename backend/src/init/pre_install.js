const fs = require('fs');
const path = require('path');
const readline = require('readline');
const childProcess = require('child_process'); // Add this line to import childProcess

//parse JSON
const configJSON = {
  "PROMPT_SERVER": "http://localhost",
  "PROMPT_SERVER_PORT": "4000",
  "DATABASE_SELECTION": "mongodb",
  "MONGODB_URI": "",
  "OPEN_AI_API_KEY": ""
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What is your MongoDB connection URI: ', (answer) => {
  configJSON.MONGODB_URI = answer;

  rl.question('What is your OpenAI API key: ', (answer) => {
    configJSON.OPEN_AI_API_KEY = answer;

    rl.question('What port do you want the server to run on: (4000): ', (answer) => {
      if (answer === '' || answer === undefined || answer === null) {
        answer = 4000;
      }
      configJSON.PROMPT_SERVER_PORT = answer;

      let envContent = '';
      for (const [key, value] of Object.entries(configJSON)) {
          envContent += `${key}=${value}\n`;
      }

      fs.writeFileSync('../.env.test', envContent);
      
      //console log new line with instructions to start docker compose build && up
      console.log('\n');
      console.log("Success!")
      console.log('\n');
      console.log('Please run the following commands to start the server:');
      console.log('docker-compose build');
      console.log('docker-compose up');
      console.log('\n');
      rl.close();

    });
  });
});