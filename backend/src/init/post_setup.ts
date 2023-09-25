const fs = require('fs');
const path = require('path');
const readline = require('readline');
const childProcess = require('child_process'); // Add this line to import childProcess

//read env.json file
const config = fs.readFileSync(path.join(__dirname, './env.json'));

//parse JSON
const configJSON = JSON.parse(config);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Which what is your MongoDB connection URI: ', (answer:any) => {
  configJSON.MONGODB_URI = answer;

  rl.question('What is your OpenAI API key: ', (answer:any) => {
    configJSON.OPEN_AI_API_KEY = answer;

    rl.question('What port should this server run on?', (answer:any) => {
      if (answer === '' || answer === undefined || answer === null) {
        answer = 4000;
      }
      configJSON.PROMPT_SERVER_PORT = answer;

      let envContent = '';
      for (const [key, value] of Object.entries(configJSON)) {
          envContent += `${key}=${value}\n`;
      }

      fs.writeFileSync('.env', envContent);

      console.log('.env file has been created successfully!');
      rl.close();

    });
  });
});