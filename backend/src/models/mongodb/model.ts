import mongoose from "mongoose";

const modelSchema = mongoose.model(
  "Model",
  new mongoose.Schema(
    {
      name: String,
      type: String,
      provider: String,
      api_call: {
        url: String,
        method: String,
        headers: mongoose.Schema.Types.Mixed,
      },
      input_format: String,
      output_format: String,
      model_parameters: mongoose.Schema.Types.Mixed,
      default: Boolean,
      organization_id: String,
      deleted: Boolean,
      request_mapping: mongoose.Schema.Types.Mixed,
      response_mapping: mongoose.Schema.Types.Mixed,
    },
    {
      timestamps: true,
    },
  ),
);

class Model {
  //assign modelSchema to variable db
  db = modelSchema;

  async createModel(modelData: any, organization_id: string) {
    //add organization_id to modelData
    modelData.organization_id = organization_id;
    const model = new modelSchema(modelData);
    await model.save();
    return model._id.toString();
  }

  async findModel(id: any, organization_id: string) {
    //find where id and organization_id match and deleted is not true
    const model = await modelSchema.findOne({
      _id: id,
      organization_id,
      deleted: { $ne: true },
    });
    return model ? this.transformModel(model) : null;
  }

  async findModelByName(name: string, organization_id: string) {
    //find where name and organization_id match and deleted is not true
    const model = await modelSchema.findOne({
      name,
      organization_id,
      deleted: { $ne: true },
    });
    return model ? this.transformModel(model) : null;
  }

  async updateModelById(updatedModel: any, organization_id: string) {
    const { id, ...modelData } = updatedModel;
    await modelSchema.updateOne({ _id: id, organization_id }, modelData);
  }

  async deleteModel(id: any, organization_id: string) {
    //set deleted to true
    await modelSchema.updateOne(
      { _id: id, organization_id },
      { deleted: true },
    );
    return id;
  }

  async countModels(organization_id: string) {
    return modelSchema.countDocuments({
      organization_id,
      deleted: { $ne: true },
    });
  }

  async listModels(organization_id: string) {
    const models = await modelSchema.find({
      organization_id,
      deleted: { $ne: true },
    });
    return models.map(this.transformModel);
  }

  transformModel(model: any) {
    const transformedModel = model.toObject();
    transformedModel.id = transformedModel._id.toString();
    delete transformedModel._id;
    return transformedModel;
  }
}

export { Model, modelSchema };
