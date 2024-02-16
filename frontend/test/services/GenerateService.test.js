import { act } from "react-dom/test-utils";
import { generateResultForPrompt } from "@/services/GenerateService"; // Adjust the path as necessary
import { modelStore } from "@/stores/ModelStore"; // Adjust the path as necessary
import { promptStore, fetchAllPrompts } from "@/stores/prompts"; // Adjust the path as necessary
import { variableStore } from "@/stores/VariableStore"; // Adjust the path as necessary
import { tabStore } from "@/stores/TabStore"; // Adjust the path as necessary

describe("generateResultForPrompt integration tests", () => {
  // Function to setup the environment before each test
  async function setupEnvironment(promptName) {
    await variableStore.getState().fetchVariables();
    const prompts = await fetchAllPrompts();

    const targetPrompt = prompts.find((prompt) => prompt.name === promptName);
    if (!targetPrompt) {
      throw new Error(`Prompt with name "${promptName}" not found.`);
    }

    await modelStore.getState().fetchAllModels();
    modelStore.getState().setModelById(targetPrompt.model);
    promptStore.getState().activateLocalPrompt(targetPrompt.id);
    tabStore.setState({
      tabs: [
        {
          name: "Test Tab",
          prompt_id: targetPrompt.id,
          current: true,
          data: {},
          loading: true,
        },
      ],
    });
    tabStore.getState().setActiveTabById(targetPrompt.id);
  }

  // Function to generate results for a given prompt name
  async function generateResultsForNamedPrompt(promptName) {
    const prompts = await fetchAllPrompts();
    const targetPrompt = prompts.find((prompt) => prompt.name === promptName);
    if (!targetPrompt) {
      throw new Error(`Prompt with name "${promptName}" not found.`);
    }

    return await generateResultForPrompt(targetPrompt.id);
  }

  beforeEach(async () => {
    // Setup with the specific prompt name for each test
    await setupEnvironment("yoda-test");
  });

  it("should handle generating results for a prompt correctly", async () => {
    await new Promise((r) => setTimeout(r, 500));

    const data = await generateResultsForNamedPrompt("yoda-test");

    await new Promise((r) => setTimeout(r, 500));

    if (!data.message || data.error) {
      console.log(data);
    }

    if (!data.message || data.error) {
      console.log(data);
    }

    expect(typeof data.message.content).toBe("string");
    expect(data.error).toBe(false);
  }, 10000);

  // This setup allows for easy addition of more tests for different prompts
  // by just adding more it() blocks and calling setupEnvironment and generateResultsForNamedPrompt
  // with the desired prompt names
});
