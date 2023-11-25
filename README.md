<div align="center">
  <a href="https://promptdesk.ai" target="_blank">
  <div>
    <source media="(prefers-color-scheme: dark)" srcset="https://promptdesk.ai/branding/logo.png">
    <img alt="PromptDesk Logo" src="https://promptdesk.ai/branding/logo.png" width="280"/>
  </div>
  </a>
</div>

<br/>

<p align="center">
  <a href="https://pypi.org/project/promptdesk/">
    <img src="https://badge.fury.io/py/promptdesk.svg" alt="pypi">
  </a>
  <a href="https://hub.docker.com/r/promptdesk/promptdesk">
    <img src="https://badgen.net/badge/icon/docker?icon=docker&label" alt="docker">
  </a>
  <a href="https://hub.docker.com/r/promptdesk/promptdesk">
    <img src="https://img.shields.io/docker/pulls/promptdesk/promptdesk.svg" alt="docker pulls">
  </a>
  <a href="https://www.gnu.org/licenses/agpl-3.0">
    <img src="https://img.shields.io/badge/License-AGPL_v3-blue.svg" alt="AGPLv3">
  </a>
</p>

<h1 align="center">A simple open-source prompt management platform.</h1>

<div align="center">
The best way to build agents and prompt-based applications.
</div>
    </br>
  <p align="center">
    <a href="https://promptdesk.ai/docs" rel="dofollow"><strong>Explore the docs »</strong></a>
  </p>
  
  <p align="center">
  Available in: <a href="https://github.com/promptdesk/promptdesk-py">Python</a>
  </p>

## ⭐️ Why PromptDesk?

PromptDesk is 100% free and open-source minimalist tool to facilitate the creation, organization, integration, and evaluation of prompts, prompt-based applications, agents and Large Language Models (LLMs).

![Alt Text](https://promptdesk.ai/branding/flowchart_banner.png)

We recommend starting with the [Quickstart](https://promptdesk.ai/docs/quickstart) guide. You can also jump straight to the [Build Prompts](https://promptdesk.ai/docs/building-prompts/) or start integrating prompts in python with [Integrate Prompts](https://promptdesk.ai/docs/python-sdk/) guides.

## ✨ Features

- 👨‍💻 OpenAI-like minimalist prompt builder
- 🥸 Prompt variable and logic support with Handlebars.js syntax
- 📊 Complete audit log of all API calls
- 🌐 Unlimited vendor-agnostic LLM API integrations
- 📦 Environment variables support
- 🚀 Easy to set up and integrate (5 minutes)
- 👨‍💻 Community-driven

## 🚀 Getting Started

PromptDesk is available as a hosted web application and as a Docker image. You can get started immediately by visiting the [PromptDesk Login](https://app.promptdesk.ai/) and creating an account. Hosting is provided for free by the MongoDB and DigitalOcean Startup Programs.

### Hosted Web Application

```shell
wget https://raw.githubusercontent.com/promptdesk/promptdesk/main/quickstart/docker-compose.yml
```

Start the Docker container:


```shell
docker compose up
```

Open your web browser and navigate to http://localhost:8080/ to access the PromptDesk application. Initial setup will require a valid OpenAI API key for installation testing purposes.

## 👨‍💻 Python Integration

To install PromptDesk, use pip:

```shell
pip install promptdesk
```

### Usage

You can call the prompt you build in the application by using the generate method.

```python
from promptdesk import PromptDesk

pd = PromptDesk(
    #defaults to os.environ.get("PROMPTDESK_API_KEY")
    api_key = "YOUR_PROMPTDESK_API_KEY"
    #defaults to https://app.promptdesk.ai
    service_url = "http://localhost:8080"
)

story = pd.generate("short-story", {
    "setting": "dark and stormy night",
    "character": "lonely farmer",
    "plot": "visited by a stranger"
})

print(story)
```

## 🔗 Important Links

For more information about PromptDesk, please refer to the following resources:

- [Documentation](https://promptdesk.ai/docs/)
- [Application GitHub Repository](https://github.com/promptdesk/promptdesk)
- [Python GitHub Repository](https://github.com/promptdesk/promptdesk-py)
- [PyPI Package](https://pypi.org/project/promptdesk/)
- [Docker Hub](https://hub.docker.com/r/promptdesk/promptdesk/)
- [Official Website](https://promptdesk.ai/)