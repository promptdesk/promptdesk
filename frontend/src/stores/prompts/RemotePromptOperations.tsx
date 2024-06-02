import { fetchFromPromptdesk } from "@/services/PromptdeskService";
import { tabStore } from "@/stores/TabStore";
import { promptStore } from "./PromptStore";
import { isValidName } from "@/services/Util";
import { modelStore } from "@/stores/ModelStore";

// Refactored to avoid repetition and enhance clarity
async function fetchAndSetPrompts() {
  const prompts = await fetchFromPromptdesk("/prompts");
  promptStore.setState({ prompts });
  return prompts;
}

export async function fetchAllPrompts() {
  return fetchAndSetPrompts();
}

export async function createNewPrompt() {

  let { promptObject } = promptStore.getState();
  if (!isValidName(promptObject.name))
    throw new Error(
      "Invalid model name or project name, only `-` and alphabets are allowed",
    );

  let isDuplicate = await isDuplicatePromptName(promptObject.name, undefined);
  if (isDuplicate) {
    throw new Error("Prompt with this name already exists, please choose other name");
  }

  if(!promptObject.project) {
    throw new Error("You must select a project name.");
  }

  delete promptObject.new; // Simplified object modification
  const data = await fetchFromPromptdesk("/prompt", "POST", promptObject);
  await fetchAndSetPrompts();
  tabStore
    .getState()
    .updateNameById(promptObject.id, data.id, promptObject.name);
  return data.id;
}

export async function updateExistingPrompt() {

  let { promptObject } = promptStore.getState();
  console.log("updateExistingPrompt", promptObject.id)

  if(!promptObject.project || promptObject.project === "") {
    throw new Error(
      "You must select a project name.",
    );
  }

  let isDuplicate = await isDuplicatePromptName(promptObject.name, promptObject.id);
  if (
    isDuplicate ||
    !isValidName(promptObject.name) ||
    (promptObject.project && !isValidName(promptObject.project))
  ) {
    return;
  }

  const { type } = modelStore.getState().modelObject;
  if (type === "chat" || type === "completion") {
    promptObject.prompt_data = { ...promptObject.prompt_data };
  }
  await fetchFromPromptdesk(`/prompt/${promptObject.id}`, "PUT", promptObject);
  await fetchAndSetPrompts();
  tabStore
    .getState()
    .updateNameById(promptObject.id, promptObject.id, promptObject.name);
}

export async function isDuplicatePromptName(name: string, id: any): Promise<boolean> {
  const dbPrompts = await fetchAndSetPrompts();

  if (id) {
    return dbPrompts.some((prompt: { name: string, id: string }) => prompt.name === name && prompt.id !== id);
  }

  return dbPrompts.some((prompt: { name: string }) => prompt.name === name);
}

export async function duplicateExistingPrompt(name: any, description: any, project: any) {
  if (!isValidName(name)) return undefined;

  const nameExists = await isDuplicatePromptName(name, undefined);
  let randomAlpha = Math.random().toString(36).substring(7);
  let promptObject = {
    ...promptStore.getState().promptObject,
    name: nameExists ? `${name}_copy_`+randomAlpha : name,
    description,
    project,
    app: undefined
  };

  const data = await fetchFromPromptdesk("/prompt", "POST", promptObject);
  promptObject.id = data.id;
  return promptObject;
}

export async function deletePrompt() {
  const { promptObject, defaultPrompt } = promptStore.getState();
  await fetchFromPromptdesk(`/prompt/${promptObject.id}`, "DELETE");
  promptStore.setState((state) => ({
    prompts: state.prompts.filter((prompt) => prompt.id !== promptObject.id),
    promptObject: { ...defaultPrompt },
  }));

  const { models } = modelStore.getState();
  const defaultModel = models.find((model) => model.default);
  modelStore.setState({
    selectedModel: defaultModel?.id,
    modelObject: defaultModel,
  });
}
