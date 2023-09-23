import mongoose from "mongoose";

const modelSchema = mongoose.model(
  'Model',
  new mongoose.Schema(
    {
      name: String,
      type: String,
      api_call: {
        url: String,
        method: String,
        headers: mongoose.Schema.Types.Mixed
      },
      input_format: String,
      output_format: String,
      model_parameters: mongoose.Schema.Types.Mixed,
      default: Boolean
    },
    {
      timestamps: true
    }
  )
);

class Model {
  
  async createModel(modelData:any) {
    const model = new modelSchema(modelData);
    await model.save();
    return model._id.toString();
  }

  async findModel(id:any) {
    const model = await modelSchema.findById(id);
    return model ? this.transformModel(model) : null;
  }

  async updateModelById(updatedModel:any) {
    const { id, ...modelData } = updatedModel;
    await modelSchema.findByIdAndUpdate(id, modelData);
  }

  async deleteModel(id:any) {
    await modelSchema.findByIdAndDelete(id);
    return id;
  }

  async countModels() {
    return modelSchema.countDocuments();
  }

  async listModels() {
    const models = await modelSchema.find();
    return models.map(this.transformModel);
  }

  transformModel(model:any) {
    const transformedModel = model.toObject();
    transformedModel.id = transformedModel._id.toString();
    delete transformedModel._id;
    return transformedModel;
  }
}

export { Model }