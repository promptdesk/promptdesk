# PromptDesk
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Promptdesk is a tool designed for effectively creating, organizing, and evaluating prompts and large language models (LLMs).

# Run
To initialize the project, run the following commands:
```sh
npm initialize.js
```

To run the project, run the following commands:
```sh
docker-compose build
docker-compose up
```

# API Documentation
## Python PIP
```sh
pip install promptdesk
```

```py
import promptdesk

promptdesk.endpoint = "https://example.com/api/magic/generate"

promptdesk.generate("yoda-test-variables", {
  "message": "What is your name?"
})
```

## JavaScript NPM
```sh
npm install promptdesk
```

```js
import PromptDesk from 'promptdesk';

const promptdesk = new PromptDesk({
  endpoint: "https://example.com/api/magic/generate",
});

promptdesk.generate("yoda-test-variables", {
  "message": "What is your name?"
})
```

## REST API
To call a prompt, send a POST request to the following endpoint:
### Python
```py
import requests
import json

url = "https://example.com/api/magic/generate"

payload = json.dumps({
  "prompt_name": "yoda-test-variables",
  "variables": {
    "message": "What is your name?"
  }
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
```

### JavaScript
```js
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://example.com/api/magic/generate',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "prompt_name": "yoda-test-variables",
    "variables": {
      "message": "What is your name?"
    }
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  //console.log(response.body);
});
```

# Requirements
- Docker
- NPM

# Roadmap
- [x] Implement prompt and model editors.
- [x] Integrate support for .env prompt variables.
- [x] Enable in-prompt variables.
- [x] Allow multi-tab prompt editing.
- [ ] Develop a REST API.
- [ ] Create a Python API.
- [ ] Build an NPM API.
- [ ] Implement dataset testing capability.
- [ ] Add support for bulk LLM (Language Model) requests.
- [ ] Add prompt history/versioning.
- [ ] Add GitHub prompt synchronization.