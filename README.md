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
  <a href="https://www.npmjs.com/package/promptdesk">
    <img src="https://badge.fury.io/js/promptdesk.svg" alt="npm">
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
  Available in: <a href="https://github.com/promptdesk/promptdesk-py">Python</a> - <a href="https://github.com/promptdesk/promptdesk-js">JavaScript</a>
  </p>

## ⭐️ Why PromptDesk?

PromptDesk is 100% free and open-source minimalist tool to facilitate the creation, organization, integration, and evaluation of prompts, prompt-based applications, agents and Large Language Models (LLMs).

If you like this project, please consider giving this repo a ⭐️ star.

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

PromptDesk is available as a Docker image.

### Quickstart

```shell
mkdir -p nginx && cd nginx && \
wget https://raw.githubusercontent.com/promptdesk/promptdesk/main/quickstart/nginx/default.conf -O default.conf && cd .. && \
wget https://raw.githubusercontent.com/promptdesk/promptdesk/main/quickstart/docker-compose.yml -O docker-compose.yml && \
docker compose up --pull always
```

**Please ensure that port 80 is available on your machine. If not, you can change the port in the docker-compose.yml file.**

Open your web browser and navigate to http://localhost to access the PromptDesk application. Initial setup will require a valid OpenAI API key for installation testing purposes.

## 👨‍💻 PromptDesk OS

Build, manage prompts and optimize prompt-based applications.

![Alt Text](https://promptdesk.ai/screenshots/completed-prompt.png)


## 👨‍💻 Python SDK

To install PromptDesk, use pip:

```shell
pip install promptdesk
```

You can call the prompt you build in the application by using the generate method.

```python
from promptdesk import PromptDesk

pd = PromptDesk(
    api_key = "YOUR_PROMPTDESK_API_KEY" #find in /settings
    service_url = "http://localhost"
)

story = pd.generate("short-story-test", {
    "setting": "dark and stormy night",
    "character": "lonely farmer",
    "plot": "visited by a stranger"
})

print(story)
```

## 👨‍💻 JavaScript SDK

To install PromptDesk, use npm:

```shell
npm install promptdesk
```

You can call the prompt you build in the application by using the generate method.

```js
import { PromptDesk } from 'promptdesk'; //ES6
//const { PromptDesk } = require('promptdesk'); //CommonJS

var pd = new PromptDesk({
    apiKey: "YOUR_PROMPTDESK_API_KEY", //find in /settings
    serviceUrl: "http://localhost"
})


const story = pd.generate("short-story-test", {
    "setting": "dark and stormy night",
    "character": "lonely farmer",
    "plot": "visited by a stranger"
})

console.log(story)
```

## 🔗 Important Links

For more information about PromptDesk, please refer to the following resources:

- [Documentation](https://promptdesk.ai/docs/)
- [Application GitHub Repository](https://github.com/promptdesk/promptdesk)
- [Python GitHub Repository](https://github.com/promptdesk/promptdesk-py)
- [PyPI Package](https://pypi.org/project/promptdesk/)
- [npm Package](https://www.npmjs.com/package/promptdesk)
- [Docker Hub](https://hub.docker.com/r/promptdesk/promptdesk/)
- [Official Website](https://promptdesk.ai/)
