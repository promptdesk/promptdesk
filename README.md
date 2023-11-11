![Alt Text](./readme_images/github_banner.png)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Docker](https://badgen.net/badge/icon/docker?icon=docker&label)](https://hub.docker.com/r/promptdesk/promptdesk)
[![PyPI version](https://badge.fury.io/py/promptdesk.svg)](https://badge.fury.io/py/promptdesk)

## What is PromptDesk?

PromptDesk is 100% free and open-source tool designed to facilitate the creation, organization, and evaluation of prompts and Large Language Models (LLMs).

If you’re new to PromptDesk, we recommend starting with the [Quickstart](https://promptdesk.ai/docs/quickstart) guide. If you’re already familiar with PromptDesk, you can jump straight to the [Build Prompts](https://promptdesk.ai/docs/building-prompts/) or [Integrate Prompts](https://promptdesk.ai/docs/python-sdk/) guides.

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

## Accessing the App

Once the Docker container is running, open your web browser and navigate to http://localhost:4000/ to access the PromptDesk application and start building prompts.

![Alt Text](./readme_images/prompt-builder.png)

Now that you have the PromptDesk application running, you can start building prompts. To get started, access the [prompt building](https://promptdesk.ai/docs/building-prompts/) guide.

That's it! You have successfully set up and run PromptDesk using the Docker image.

## Using the Python Library

To use the PromptDesk library in your Python code, follow these steps:

1. Install the PromptDesk library by running the following command:

   ```shell
   pip install promptdesk
   ```

2. Import the library into your Python code:

   ```python
   import promptdesk
   ```

3. Set the service URL to the running Docker container:

   ```python
   promptdesk.SERVICE_URL = "http://localhost:4000"
   ```

4. Generate a story using the `generate` function:

   ```python
   story = promptdesk.generate("short-story-generator", {
       "setting": "A dark and stormy night",
       "character": "A lonely farmer",
       "plot": "A farmer is visited by a stranger"
   })
   ```

   Replace the values for `setting`, `character`, and `plot` with your desired story prompts.

5. Print the generated story:

   ```python
   print(story)
   ```

That's it! You can now use the PromptDesk library to generate stories by calling the `generate` function with your desired prompts.

## Documentation

For more information about PromptDesk, please refer to the following resources:

- [GitHub Repository](https://github.com/promptdesk/promptdesk)
- [PyPI Package](https://pypi.org/project/promptdesk/)
- [Docker Hub](https://hub.docker.com/r/promptdesk/promptdesk/)
- [Official Website](https://promptdesk.ai/)

## Troubleshooting

If you encounter any issues or bugs while using PromptDesk, please report them by creating a [new issue](https://github.com/promptdesk/promptdesk/issues) on the GitHub repository. Include as much detail as possible, such as steps to reproduce the issue and any error messages or logs.

## Contributing

We welcome contributions to improve PromptDesk! If you would like to contribute, please refer to the [Contribution Guidelines](https://github.com/promptdesk/promptdesk/blob/main/CONTRIBUTING.md).

## License

By using or contributing to PromptDesk, you agree that your usage or contributions will be licensed under the GNU Affero General Public License. For more information, please refer to the [LICENSE](https://github.com/promptdesk/promptdesk/blob/main/LICENSE) file in the repository.

## Contact

If you have any questions or need further assistance, please reach out to us at feedback@promptdesk.ai. We will be happy to help!

## Thank you

Thank you for your support! We hope you find PromptDesk useful. If you like the project, please consider giving it a star on GitHub. This is a 100% free, open-source project.
   
## Roadmap

### To-Do
- [ ] Build an NPM API.
- [ ] Implement dataset testing capability.
- [ ] Add support for bulk LLM (Language Model) requests.
- [ ] Add prompt history/versioning.
- [ ] Add GitHub prompt synchronization.

### Complete
- [x] Implement prompt and model editors.
- [x] Integrate support for .env prompt variables.
- [x] Enable in-prompt variables.
- [x] Allow multi-tab prompt editing.
- [X] Develop a REST API.
- [X] Create a Python API.