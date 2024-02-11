import { testFromPromptdesk } from "./PromptdeskService";

const testAPI = async (data: object) => {
  var endpoint = "/generate/test/endpoint";
  if ((data as any).input_format) {
    endpoint = "/generate/test/inputformat";
  }

  try {
    var response = await testFromPromptdesk(endpoint, "POST", data);
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export { testAPI };
