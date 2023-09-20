import mongoose from "mongoose";

const promptSchema = mongoose.model(
  'PromptX',
  new mongoose.Schema({
    name: String,
    description: String,
    model: String,
    prompt_variables: mongoose.Schema.Types.Mixed,
    prompt_parameters: mongoose.Schema.Types.Mixed,
    prompt_data: mongoose.Schema.Types.Mixed,
    model_type: String
  }, {
    timestamps: true
  })
);

export default class PromptModel {
  async createPrompt(promptData) {
    const prompt = new promptSchema(promptData);
    await prompt.save();
    return prompt._id.toString();
  }

  async findPrompt(id) {
    const prompt = await promptSchema.findById(id);
    return prompt ? this.transformPrompt(prompt) : null;
  }

  async findPromptByName(name) {
    const prompt = await promptSchema.findOne({ name });
    return prompt ? this.transformPrompt(prompt) : null;
  }

  async updatePromptById(updatedPrompt) {
    const { id, ...promptData } = updatedPrompt;
    await promptSchema.findByIdAndUpdate(id, promptData);
  }

  async deletePrompt(id) {
    await promptSchema.findByIdAndDelete(id);
    return id;
  }

  async countPrompts() {
    return promptSchema.countDocuments();
  }

  async listPrompts() {
    const prompts = await promptSchema.find();
    return prompts.map(this.transformPrompt);
  }

  transformPrompt(prompt) {
    const transformedPrompt = prompt.toObject();
    transformedPrompt.id = transformedPrompt._id.toString();
    delete transformedPrompt._id;
    return transformedPrompt;
  }
}
