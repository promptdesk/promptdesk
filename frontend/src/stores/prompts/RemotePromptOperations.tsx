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
  if (
    !isValidName(promptObject.name) ||
    (promptObject.project && !isValidName(promptObject.project))
  )
    return;

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
  if (
    !isValidName(promptObject.name) ||
    (promptObject.project && !isValidName(promptObject.project))
  )
    return;

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

export async function duplicateExistingPrompt(name: any, description: any) {
  if (!isValidName(name)) return undefined;

  const dbPrompts = await fetchAndSetPrompts();
  const nameExists = dbPrompts.some(
    (prompt: { name: any }) => prompt.name === name,
  );
  let promptObject = {
    ...promptStore.getState().promptObject,
    name: nameExists ? `${name}_copy` : name,
    description,
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
