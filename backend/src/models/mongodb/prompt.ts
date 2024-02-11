import mongoose from "mongoose";
import { Prompt as PromptInterface } from "@/interfaces/prompt";

const promptSchema = mongoose.model(
  "PromptX",
  new mongoose.Schema(
    {
      name: String,
      description: String,
      model: String,
      prompt_variables: mongoose.Schema.Types.Mixed,
      prompt_parameters: mongoose.Schema.Types.Mixed,
      prompt_data: mongoose.Schema.Types.Mixed,
      model_type: String,
      organization_id: String,
      project: String,
    },
    {
      timestamps: true,
    },
  ),
);

class Prompt {
  async createPrompt(promptData: PromptInterface, organization_id: string) {
    //add organization_id to promptData
    promptData.organization_id = organization_id;
    const prompt = new promptSchema(promptData);
    await prompt.save();
    return prompt._id.toString();
  }

  async findPrompt(id: any, organization_id: string) {
    const prompt = await promptSchema.findOne({ _id: id, organization_id });
    return prompt ? this.transformPrompt(prompt) : null;
  }

  async findPromptByName(name: any, organization_id: string) {
    const prompt = await promptSchema.findOne({ name, organization_id });
    return prompt ? this.transformPrompt(prompt) : null;
  }

  async findPromptByModelId(modelId: string) {
    const prompt = await promptSchema.findOne({ model: modelId });
    return prompt;
  }

  async updatePrompt(updatedPrompt: any, organization_id: string) {
    const { id, ...promptData } = updatedPrompt;
    await promptSchema.findOneAndUpdate(
      { _id: id, organization_id },
      promptData,
    );
  }

  async deletePrompt(id: any, organization_id: string) {
    await promptSchema.findOneAndDelete({ _id: id, organization_id });
    return id;
  }

  async countPrompts(organization_id: string) {
    return promptSchema.countDocuments({ organization_id });
  }

  async listPrompts(organization_id: string) {
    const prompts = await promptSchema.find({ organization_id });
    return prompts.map(this.transformPrompt);
  }

  transformPrompt(prompt: any) {
    const transformedPrompt = prompt.toObject();
    transformedPrompt.id = transformedPrompt._id.toString();
    delete transformedPrompt._id;
    return transformedPrompt;
  }
}

export { Prompt, promptSchema };
