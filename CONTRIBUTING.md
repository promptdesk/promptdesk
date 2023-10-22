# Contributing to PromptDesk

Thank you for your interest in contributing to PromptDesk! Here's a step-by-step guide to get started:

## Step 1: Fork the Repository

To contribute to PromptDesk, you'll need to fork the repository. Click on the "Fork" button at the top right corner of the repository page. This will create a copy of the repository under your GitHub account.

## Step 2: Clone the Repository

Once you have forked the repository, you'll need to clone it to your local machine. Open your terminal and navigate to the directory where you want to clone the repository. Then run the following command:

```
git clone git@github.com:your-username/promptdesk.git
```

Replace `your-username` with your GitHub username.

Go to the root directory of the cloned repository:

```
cd promptdesk
```

## Step 3: Set Up the Development Environment

Before you can start contributing, you'll need to set up the development environment. PromptDesk uses Node.js and MongoDB. Follow these steps to set up the environment:

1. Install Node.js: Visit the [Node.js website](https://nodejs.org) and download the latest LTS version for your operating system. Follow the installation instructions to install Node.js.

2. Install MongoDB: Visit the [MongoDB website](https://www.mongodb.com) and download the Community Server version for your operating system. Follow the installation instructions to install MongoDB. Alternatively, you can use a MongoDB instance hosted on the cloud. MongoDB Atlas offers a free tier that you can use for development.

3. Create a `.env.development.local` file: In the root directory of the cloned repository, create a file named `.env.development.local`. Open the file and add the following content:

   ```env
   PROMPT_SERVER_PORT=4000
   OPEN_AI_KEY=[YOUR OPEN AI API KEY]
   MONGO_URL=[YOUR MONGODB CONNECTION URI]
   ```

   Replace `[YOUR OPEN AI API KEY]` with your OpenAI API key, and `[YOUR MONGODB CONNECTION URI]` with the connection URI for your MongoDB instance.

## Step 4: Start Backend Server

Install dependencies: Open your terminal, navigate to the `backend` directory of the cloned repository, and run the following command to install the project dependencies:

   ```
   cd backend
   npm install
   ```

Start the development server: Run the following command to start the development server:

   ```
   npm run dev
   ```

## Step 5: Start Frontend Server

Install dependencies: Open your terminal, navigate to the `frontend` directory of the cloned repository, and run the following command to install the project dependencies:

   ```
   cd frontend
   npm install
   ```

Start the development server: Run the following command to start the development server:

   ```
   npm run dev
   ```

## Step 6: Make Changes and Test

Now you're ready to make changes to the codebase. You can start by fixing bugs, adding new features, or improving the documentation. Make sure to create a new branch for your changes. You can do this by running the following command in your terminal:

```
git checkout -b my-branch-name
```

Replace `my-branch-name` with a descriptive name for your branch.

Once you have made your changes, you can test them by running the following command in the `backend` directory:

```
npm run test
```

Make sure all tests pass before proceeding.

## Step 7: Submit a Pull Request

When you're ready to submit your changes, push your branch to your forked repository:

```
git push origin my-branch-name
```

Then, navigate to the original PromptDesk repository on GitHub and click on the "New Pull Request" button. Follow the instructions to submit your pull request.

That's it! You have successfully contributed to PromptDesk. Thank you for your contribution!

## Additional Information

### Code Style

Please follow the existing code style and conventions used in the project. This helps maintain consistency and makes it easier for others to understand and review your code.

### Reporting Issues

If you encounter any issues or bugs while using PromptDesk, please report them by creating a new issue on the GitHub repository. Include as much detail as possible, such as steps to reproduce the issue and any error messages or logs.

### Feature Requests

If you have any ideas or suggestions for new features or improvements, we would love to hear them! Please create a new issue on the GitHub repository and describe your feature request in detail.

### Documentation

Improvements to the documentation are always appreciated. If you find any errors or have suggestions for clarifications or additions, please submit a pull request with your changes.

### Testing

When making changes or adding new features, please ensure that you test your changes thoroughly. This helps maintain the stability and reliability of the project.

### Code Review

All contributions will go through a code review process. This helps ensure the quality and maintainability of the codebase. Please be open to feedback and make any necessary changes based on the review comments.

### License

By using or contributing to PromptDesk, you agree that your contributions will be licensed under the GNU Affero General Public License. For more information, please refer to the [LICENSE](https://github.com/promptdesk/promptdesk/blob/main/LICENSE) file in the repository.

### Contact

If you have any questions or need further assistance, please reach out to us at feedback@promptdesk.ai. We will be happy to help!

Thank you for your interest in contributing to PromptDesk! We appreciate your support.