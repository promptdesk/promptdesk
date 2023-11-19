![Alt Text](./readme_images/github_banner.png)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Docker](https://badgen.net/badge/icon/docker?icon=docker&label)](https://hub.docker.com/r/promptdesk/promptdesk)
[![PyPI version](https://badge.fury.io/py/promptdesk.svg)](https://badge.fury.io/py/promptdesk)

## What is PromptDesk?

PromptDesk is 100% free and open-source tool designed to facilitate the creation, organization, integration, and evaluation of prompts, prompt-based applications and Large Language Models (LLMs).

![Alt Text](./readme_images/flowchart_banner.jpeg)

### PrompDesk Manager

The PromptDesk GUI is an OpenAI playground clone that makes it easy to build and organize prompt-based applications.
- Workspace: Build and test completion, code and chat prompts with variables.
- Prompts: Create and organize prompts.
- Models: Create, edit, test and add unlimited LLM models.
- Logs: View, analyze and export prompt calls.
- Settings: Configure variables and API keys.

### PromptDesk Python SDK

The PrompDesk Python PIP Package is an ultra-lightweight library to call and process prompts remotely or locally.
- Generate: Call prompts remotely or locally.
- JSON: Convert prompts to JSON format.
- Variables: Add variables to prompts.
- Data validation: Validate prompt data.

We recommend starting with the [Quickstart](https://promptdesk.ai/docs/quickstart) guide. You can also jump straight to the [Build Prompts](https://promptdesk.ai/docs/building-prompts/) or start integrating prompts in python with [Integrate Prompts](https://promptdesk.ai/docs/python-sdk/) guides.

## Quickstart

PromptDesk is available as a hosted web application and as a Docker image.

### Hosted Web Application

You can get started immediately by visiting the [PromptDesk Login](https://app.promptdesk.ai/) and creating an account.
Hosting is provided for free by the MongoDB and DigitalOcean Startup Programs.

The hosted web application will always be free, up-to-date, with full support for all features. However, log storage is limited to 10k records per user.

All data can be exported or transfered at any time.

### Docker Image

```shell
wget https://raw.githubusercontent.com/promptdesk/promptdesk/main/quickstart/docker-compose.yml
```

Start the Docker container:

```shell
docker compose up
```

Open your web browser and navigate to http://localhost:8080/ to access the PromptDesk application. Initial setup will require a valid OpenAI API key for installation testing purposes.

## Important Links

For more information about PromptDesk, please refer to the following resources:

- [Documentation](https://promptdesk.ai/docs/)
- [Application GitHub Repository](https://github.com/promptdesk/promptdesk)
- [Python GitHub Repository](https://github.com/promptdesk/promptdesk-py)
- [PyPI Package](https://pypi.org/project/promptdesk/)
- [Docker Hub](https://hub.docker.com/r/promptdesk/promptdesk/)
- [Official Website](https://promptdesk.ai/)