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
  <img src="https://github.com/promptdesk/promptdesk/actions/workflows/main.yml/badge.svg">
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

<h1 align="center">Bold Innovation, Simplified AI</h1>

<div align="center">
PromptDesk is 100% free and open-source minimalist tool to facilitate the creation, organization, integration, and evaluation of prompts, prompt-based applications, agents and Large Language Models (LLMs).
</div>
    </br>
  <p align="center">
    <a href="https://promptdesk.ai/docs/quickstart" rel="dofollow"><strong>Quickstart Guide »</strong></a>
    <br />
      <br/>
    <a href="https://promptdesk.ai/features">Features</a>
    ·
  <a href="https://promptdesk.ai/podcast">Podcast</a>
    ·
    <a href="https://promptdesk.ai/articles">Articles</a>
    ·
    <a href="https://promptdesk.ai/contributors">Contributors</a>
    ·
    <a href="https://github.com/promptdesk/promptdesk/discussions">Community</a>
  </p>

  <p align="center">
  Available in: <a href="https://github.com/promptdesk/promptdesk-py">Python</a> - <a href="https://github.com/promptdesk/promptdesk-js">JavaScript</a>
  </p>

</div>

If you like this project, please consider giving this repo a ⭐️ star.

![Alt Text](https://promptdesk.ai/screenshots/completed-prompt.png)

## Features

- 🤝 Cross-team Collaboration
- 📚 Comprehensive Documentation
- 📅 Deploy One-click Apps for Sharing
- 👨‍💻 Python and Javascript SDK
- 🏠 Local or Proxied Calls 
- 📈 Comprehensive Logs
- ♾️ Unlimited Models
- 🔐 Data Privacy and Security
- 🌐 Any model, any scale
- 🚀 Easy to set up and integrate (5 minutes)

## 🚀 Getting Started and Installation

To get started with PromptDesk OS, visit [promptdesk.ai/docs/quickstart](https://promptdesk.ai/docs/quickstart) for the installation script. It's a simple, two-line install process that takes an average of just 5 minutes from start to finish.

PromptDesk OS is a self-hosted, 100% free and open-source Docker container that can be deployed anywhere.

You can also jump straight to [building prompts](https://promptdesk.ai/docs/building-prompts) or start integrating prompts in [python](https://promptdesk.ai/docs/python-sdk/pip-package) or [javascript](https://promptdesk.ai/docs/javascript-sdk/npm-package).

## Python SDK

Using the PromptDesk Python SDK, you can easily integrate your prompts into your Python applications.

```shell
pip install promptdesk
```

You can call the prompt you build in the application by using the generate method.

```python
from promptdesk import PromptDesk

pd = PromptDesk(
    api_key = "YOUR_PROMPTDESK_API_KEY", #find in /settings
    service_url = "http://localhost"
)

story = pd.generate("short-story-test", {
    "setting": "dark and stormy night",
    "character": "lonely farmer",
    "plot": "visited by a stranger"
})

print(story)
```

## JavaScript SDK

Using the PromptDesk JavaScript SDK, you can easily integrate your prompts into your Python applications.

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

const story = await pd.generate("short-story-test", {
    "setting": "dark and stormy night",
    "character": "lonely farmer",
    "plot": "visited by a stranger"
})

console.log(story)
```

## 🔗 Important Links

For more information about PromptDesk, please refer to the following resources:

- [Quickstart Guide](https://promptdesk.ai/docs/quickstart)
- [Application GitHub Repository](https://github.com/promptdesk/promptdesk)
- [Python GitHub Repository](https://github.com/promptdesk/promptdesk-py)
- [PyPI Package](https://pypi.org/project/promptdesk/)
- [npm Package](https://www.npmjs.com/package/promptdesk)
- [Docker Hub](https://hub.docker.com/r/promptdesk/promptdesk/)
- [Official Website](https://promptdesk.ai/)
