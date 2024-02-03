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
        promptStore.setState((state: { prompts: any[]; }) => ({
            prompts: state.prompts.map((prompt) => {
                if (prompt.id === promptObject.id) {
                    return promptObject;
                } else {
                    return prompt;
                }
            })
        }));

        return { promptObject };
    });
}

export function addMessage(roles: string[]) {
    promptStore.setState((state) => {
        const promptObject = { ...state.promptObject };
        const messages = promptObject.prompt_data.messages || [];
        const lastRole = messages.length > 0 ? messages[messages.length - 1].role : roles[1];
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