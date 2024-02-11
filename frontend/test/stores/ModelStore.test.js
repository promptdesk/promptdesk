import { act } from "react-dom/test-utils";
import { modelStore } from "@/stores/ModelStore"; // Adjust the path as necessary

describe("modelStore tests", () => {
  describe("fetchAllModels", () => {
    it("should fetch all models and update the store", async () => {
      let models;
      await act(async () => {
        models = await modelStore.getState().fetchAllModels();
      });
      expect(models).toBeDefined();
      expect(Array.isArray(models)).toBe(true);
    });
  });

  describe("setModelById", () => {
    it("should set a model by ID and update the store", async () => {
      // Pre-fetch models to ensure the store is populated
      await act(async () => {
        await modelStore.getState().fetchAllModels();
      });

      const testModelId = modelStore.getState().models[0].id;

      await act(async () => {
        modelStore.getState().setModelById(testModelId);
      });

      const { modelObject, selectedModel } = modelStore.getState();

      expect(modelObject).toBeDefined();
      expect(modelObject.id).toBe(testModelId);
      expect(selectedModel).toBe(testModelId);
    });
  });
});
