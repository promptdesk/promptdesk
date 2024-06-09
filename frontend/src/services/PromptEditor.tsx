import { promptStore } from "@/stores/prompts";

export function removeAtIndex(index: number) {
  promptStore.setState((state) => {
    const promptObject = { ...state.promptObject };
    promptObject.prompt_data.messages.splice(index, 1);
    return { promptObject };
  });
}

export function editMessageAtIndex(index: number, newValue: string) {
  promptStore.setState((state) => {
    const promptObject = { ...state.promptObject };
    promptObject.prompt_data.messages[index].content = newValue;
    promptStore.setState({ promptObject });

    //set promptObject in prompts
    promptStore.setState((state: { prompts: any[] }) => ({
      prompts: state.prompts.map((prompt) => {
        if (prompt.id === promptObject.id) {
          return promptObject;
        } else {
          return prompt;
        }
      }),
    }));

    return { promptObject };
  });
}

export function createFileAtIndex(
  messageIndex: number,
  fileIndex: number,
  obj: { [key: string]: any },
) {
  promptStore.setState((state) => {
    const promptObject = { ...state.promptObject };
    const files = promptObject.prompt_data.messages[messageIndex].files || [];
    files.push(obj);
    promptObject.prompt_data.messages[messageIndex].files = files;
    return { promptObject };
  });
}

//update the value of the files[fileIndex][name] = value in
export function updateFileAtIndex(
  messageIndex: number,
  fileIndex: number,
  name: string,
  value: string,
) {
  promptStore.setState((state) => {
    const promptObject = { ...state.promptObject };
    const files = promptObject.prompt_data.messages[messageIndex].files || [];
    files[fileIndex][name] = value;
    promptObject.prompt_data.messages[messageIndex].files = files;
    return { promptObject };
  });
}

export function deleteFileAtIndex(messageIndex: number, fileIndex: number) {
  promptStore.setState((state) => {
    const promptObject = { ...state.promptObject };
    const files = promptObject.prompt_data.messages[messageIndex].files || [];
    files.splice(fileIndex, 1);
    promptObject.prompt_data.messages[messageIndex].files = files;
    //if files is empty, remove the files key
    if (files.length === 0) {
      delete promptObject.prompt_data.messages[messageIndex].files;
    }
    return { promptObject };
  });
}

export function addMessage(roles: string[]) {
  promptStore.setState((state) => {
    const promptObject = { ...state.promptObject };
    const messages = promptObject.prompt_data.messages || [];
    const lastRole =
      messages.length > 0 ? messages[messages.length - 1].role : roles[1];
    const roleIndex = (roles.indexOf(lastRole) + 1) % roles.length;
    const newMessage = { role: roles[roleIndex], content: "" };
    messages.push(newMessage);
    promptObject.prompt_data.messages = messages;
    return { promptObject };
  });
}

export function toggleRoleAtIndex(index: number, roles: string[]) {
  promptStore.setState((state) => {
    const promptObject = { ...state.promptObject };
    const messages = promptObject.prompt_data.messages || [];
    const role = messages[index].role;
    const newRole = roles[(roles.indexOf(role) + 1) % roles.length];
    messages[index].role = newRole;
    promptObject.prompt_data.messages = messages;
    return { promptObject };
  });
}
