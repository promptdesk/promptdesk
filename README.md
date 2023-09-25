# PromptDesk
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

PromptDesk is a versatile tool designed to facilitate the creation, organization, and evaluation of prompts and Large Language Models (LLMs). This guide will help you set up PromptDesk on your system quickly and efficiently.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Installation

1. **Clone the Repository**
   
   Open your terminal and run the following command to clone the PromptDesk repository:

   ```bash
   git clone git@github.com:promptdesk/promptdesk.git
   ```

2. **Navigate to the Project Directory**
   
   Change to the newly created `promptdesk` directory:

   ```bash
   cd promptdesk
   ```

3. **Start the Service with Docker Compose**
   
   Run Docker Compose to start the PromptDesk service:

   ```bash
   docker-compose up -d
   ```

   This command will download the necessary Docker images and start the services in detached mode.

   After running the above commands, check the status of the Docker containers to ensure that they are up and running:

   ```bash
   docker ps
   ```

## Start Building

- Open a web browser and navigate to the application URL (e.g., `http://localhost:port`). The specific port number will be mentioned in the project documentation or Docker Compose file.

  ```bash
  http://localhost:4000
  ```

## Usage

Once the application is running, you can start creating, organizing, and evaluating prompts and LLMs. Refer to the official [PromptDesk Documentation](https://promptdesk.ai/docs) for detailed instructions and examples.

## Troubleshooting

If you encounter any issues during installation or usage, please check the [Troubleshooting Guide](#) or [FAQs](#) section. For further assistance, feel free to [raise an issue](https://github.com/promptdesk/promptdesk/issues) on the GitHub repository.

## Contributing

We welcome contributions to improve PromptDesk!

## License

PromptDesk is licensed under the [MIT License](#). For more information, please refer to the [LICENSE](#) file in the repository.

## Contact

For any queries or suggestions, please reach out to us at [feedback@promptdesk.ai](mailto:feedback@promptdesk.ai). This is a shared inbox. We will get back to you as soon as possible.

## Thank you

Thank you for your support! We hope you find it useful. If you like the project, please consider giving it a star on GitHub. This is a 100% free, open-source project.

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