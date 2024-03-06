# Contributing to PromptDesk

Thank you for your interest in contributing to PromptDesk! Here's a step-by-step guide to get started:

## Setup

### Before you begin

Before you can start contributing, you'll need to install Docker and get an OpenAI API key.

1. [Docker](https://www.docker.com/get-started/)
2. [OpenAI API key](https://platform.openai.com/api-keys)

A recommended minimum of 2 GB of RAM is required to run the development environment.

### Step 1: Fork the Repository

To contribute to PromptDesk, you'll need to fork the repository. Click on the "Fork" button at the top right corner of the repository page. This will create a copy of the repository under your GitHub account.

### Step 2: Clone the Repository

Once you have forked the repository, you'll need to clone it to your local machine. Open your terminal and navigate to the directory where you want to clone the repository. Then run the following command:

```
git clone git@github.com:your-username/promptdesk.git
```

Replace `your-username` with your GitHub username.

Go to the root directory of the cloned repository:

```
cd promptdesk
```

Open your favourite code editor to view source code files and make changes.

### Step 3: Setup Environment

Run the setup.sh script to configure the environment variables:

```
chmod +x setup.sh && ./setup.sh
```

Enter your OpenAI API key when prompted.

To view different .env variables and their descriptions, open the .env file in the root directory.

### Step 4: Start the Development Environment

To start the development environment, run the following command in your terminal:

```
docker compose up
```

It may take a few minutes to start the development environment for the first time. Once the development environment is ready, you should see the following success message in your terminal:

```
  ____                            _   ____            _       ___  ____  
 |  _ \ _ __ ___  _ __ ___  _ __ | |_|  _ \  ___  ___| | __  / _ \/ ___| 
 | |_) | '__/ _ \| '_ ` _ \| '_ \| __| | | |/ _ \/ __| |/ / | | | \___ \ 
 |  __/| | | (_) | | | | | | |_) | |_| |_| |  __/\__ \   <  | |_| |___) |
 |_|   |_|  \___/|_| |_| |_| .__/ \__|____/ \___||___/_|\_\  \___/|____/ 
                           |_|                                           
```

You can access the front-end React code here:

```
http://localhost:3000
```

Hot reloads are enabled by default, so you can make changes to the front-end code and see them reflected in the browser without restarting the development environment.

## Making Changes

### Step 1: Make Changes and Test

Now you're ready to make changes to the codebase. You can start by fixing bugs, adding new features, or improving the documentation. Make sure to create a new branch for your changes. You can do this by running the following command in your terminal:

```
git checkout -b my-branch-name
```

Replace `my-branch-name` with a descriptive name for your branch.

### Step 2: Submit a Pull Request

When you're ready to submit your changes, push your branch to your forked repository:

```
git push origin my-branch-name
```

Then, navigate to the original PromptDesk repository on GitHub and click on the "New Pull Request" button. Follow the instructions to submit your pull request.

## Thank you!

If you have any questions or feedback please reach out to us at feedback@promptdesk.ai.

Thank you for your interest in contributing to PromptDesk! We appreciate your support.