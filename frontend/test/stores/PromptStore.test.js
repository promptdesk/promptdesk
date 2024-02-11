import { act } from "react-dom/test-utils";
import { promptStore, fetchAllPrompts } from "@/stores/prompts"; // Adjust the path as necessary

describe("promptStore tests", () => {
  beforeEach(() => {
    // Resetting the state before each test can be helpful
    promptStore.setState({
      promptObject: JSON.parse(JSON.stringify({})),
      prompts: [],
      selectedVariable: "",
      parsingError: null,
      // other initial states
    });
  });

  // Test for fetchAllPrompts method
  describe("fetchAllPrompts", () => {
    it("should fetch all prompts and update the store", async () => {
      let prompts;
      await act(async () => {
        prompts = await fetchAllPrompts();
      });
      expect(prompts).toBeDefined();
      expect(Array.isArray(prompts)).toBe(true);
      expect(prompts.length).toBeGreaterThan(0);
    });
  });

  // Test for updateLocalPromptValues method
  describe("updateLocalPromptValues", () => {
    it("should set prompt information correctly", () => {
      const key = "name";
      const value = "Test Prompt";

      act(() => {
        promptStore.getState().updateLocalPromptValues(key, value);
      });

      const promptObject = promptStore.getState().promptObject;
      expect(promptObject).toHaveProperty(key, value);
    });
  });
});
