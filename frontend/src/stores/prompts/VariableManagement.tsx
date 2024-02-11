import { extractVariablesFromAST } from "@/services/Util";
import Handlebars from "handlebars";
import { promptStore } from "@/stores/prompts/PromptStore";

export function processVariables(inputValue: string) {
  const { promptObject } = promptStore.getState();

  if (!inputValue) {
    inputValue = "";
  }

  try {
    promptStore.setState((state) => {
      const ast = Handlebars.parse(inputValue);
      let variableTypes = extractVariablesFromAST(ast);
      let variables = Object.keys(variableTypes);

      const promptObject = { ...state.promptObject };

      const newPromptVariableData = variables.reduce(
        (acc: any, variable: any) => {
          acc[variable] =
            promptObject.prompt_variables[variable] ||
            (variableTypes as any)[variable];
          return acc;
        },
        {},
      );

      promptObject.prompt_variables = newPromptVariableData;
      return { parsingError: "", promptObject };
    });
  } catch (error: any) {
    // Record the error so it can be displayed to the user.
    promptStore.setState((state) => {
      return { parsingError: error };
    });
  }
}

export async function setSelectedVariable(variable: string) {
  promptStore.setState({ selectedVariable: variable });
}

export async function setPromptVariables(variables: any) {
  promptStore.setState((state) => {
    const promptObject = { ...state.promptObject };
    promptObject.prompt_variables = variables;
    return { promptObject };
  });
}
