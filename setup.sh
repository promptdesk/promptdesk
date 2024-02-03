#!/bin/bash

# This is to create a local development environment for the prompt server and the front-end.
# Prompt the user for the OpenAI API key
read -p "Enter your OpenAI API key: " openai_api_key

# Create the .env file with the provided and user-input data
cat << EOF > .env
HOSTING=local #used for self hosting and development
NODE_ENV=development #used for development
SETUP=true #used to setup the development environment
PROMPT_SERVER_PORT=4000 #the port that the prompt server will run on
PROMPT_SERVER_URL=http://localhost:4000 #the url that the front-end will call
MONGO_URL=mongodb://mongodb:27017/app #the url to your mongodb instance
ORGANIZATION_API_KEY=51cc56c3f7658fec052ce93f5659be194771b136dae2d8ba #the api key for the organization used by the - front-end
OPENAI_API_KEY=$openai_api_key #the api key for openai
EMAIL=example@example.com #the default email for the admin user
PASSWORD=password123 #the default password for the admin user
EOF

echo ".env file has been created."