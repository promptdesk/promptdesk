import { act } from "react-dom/test-utils";
import { sampleStore } from "@/stores/SampleStore"; // Adjust the path as necessary
import { promptStore, fetchAllPrompts } from "@/stores/prompts"; // Adjust the path as necessary

describe("sampleStore tests", () => {
  // Test for fetchSamples method
  describe("fetchSamples", () => {
    it("should fetch samples with default parameters", async () => {
      let samples;
      let prompts;
      await act(async () => {
        prompts = await fetchAllPrompts();
      });
      //find prompt with name yoda-test
      let yodaPrompt = prompts.find((prompt) => prompt.name === "yoda-test");
      await act(async () => {
        samples = await sampleStore.getState().fetchSamples(1, yodaPrompt.id);
      });
      expect(samples).toBeDefined();
      expect(Array.isArray(samples)).toBe(true);
    });
  });
});
