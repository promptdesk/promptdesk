import { tabStore } from "@/stores/TabStore";
import { modelStore } from "@/stores/ModelStore";
import { promptStore } from "@/stores/prompts";
import { variableStore } from "@/stores/VariableStore";
import { fetchFromPromptdesk } from "@/services/PromptdeskService";
import { Tab } from "@/interfaces/tab";

const generateResultForPrompt = async (promptId: string) => {
  const currentTabData = tabStore.getState().getDataById(promptId);

  if (currentTabData.loading) {
    return;
  }

  const model = modelStore.getState().modelObject;
  const prompt = promptStore.getState().promptObject;
  const variables = variableStore.getState().variables;
  const previousId = prompt.id;

  let api_call = JSON.stringify(model.api_call);
  const regex = /{{(.*?)}}/g;
  const matches = api_call.match(regex);
  const variableList = matches ? matches.map((m) => m.slice(2, -2)) : [];

  var error = false;
  var missing_variable = undefined;
  variableList.forEach((variableName) => {
    const variable = variables.find((v) => v.name === variableName);
    // Check if the variable exists and has a non-empty value
    if (variable && variable.value && variable.value !== "") {
    } else {
      error = true;
      missing_variable = variableName;
    }
  });

  if (error) {
    return;
  }

  promptStore.getState().updateLocalPrompt(prompt);

  try {
    //updateWorkspaceTabs(promptId, { loading: true });
    tabStore.getState().updateDataById(promptId, { loading: true });
    const data = await fetchFromPromptdesk("/generate", "POST", prompt);
    tabStore.getState().updateDataById(promptId, { loading: false });
    const currentPrompt = promptStore.getState().promptObject;

    if (model.type === "chat" && data.message) {
      if (prompt.id === currentPrompt.id) {
        promptStore.setState((state) => {
          const messages = [
            ...state.promptObject.prompt_data.messages,
            data.message,
          ];
          const context = state.promptObject.prompt_data.context;
          return {
            promptObject: {
              ...state.promptObject,
              prompt_data: { messages, context },
            },
          };
        });
      } else {
        promptStore.setState((state) => {
          const prompts = state.prompts.map((p) => {
            if (p.id === previousId) {
              const messages = [...p.prompt_data.messages, data.message];
              const context = p.prompt_data.context;
              return { ...p, prompt_data: { messages, context } };
            }
            return p;
          });
          return { prompts };
        });
      }
    }

    if (model.type === "completion") {
      tabStore.getState().updateDataById(promptId, {
        loading: false,
        generatedText: data.message,
        error: undefined,
      });
    }

    return data;
  } catch (error: any) {
    tabStore.getState().updateDataById(promptId, {
      loading: false,
      error: error.message,
      logId: error.response?.data?.log_id,
    });
  }
};

export { generateResultForPrompt };
