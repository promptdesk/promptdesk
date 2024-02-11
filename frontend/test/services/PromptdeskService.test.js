import { fetchFromPromptdesk } from "@/services/PromptdeskService"; // Adjust the import path according to your project structure
import { expect } from "chai";

describe("fetchFromPromptdesk Integration Tests", () => {
  it("should make a GET request and return data", async () => {
    const response = await fetchFromPromptdesk("/models");
    expect(response).to.be.an("array");
  });
});
