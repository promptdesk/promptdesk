import mongoose from "mongoose";

const variableSchema = mongoose.model(
  "Variable",
  new mongoose.Schema(
    {
      data: [
        {
          name: String,
          value: String,
        },
      ],
      organization_id: String,
    },
    {
      timestamps: true,
    },
  ),
);

class Variable {
  async createVariables(data_list: any, organization_id: string) {
    const prompt = new variableSchema({
      data: data_list,
      organization_id: organization_id,
    });
    await prompt.save();
    return prompt._id.toString();
  }

  async updateVariables(data_list: any, organization_id: string) {
    const variables = await variableSchema.findOne({ organization_id });
    const id = variables?._id;
    await variableSchema.findByIdAndUpdate(id, {
      data: data_list,
    });
  }

  async getVariables(organization_id: string) {
    var variables: any = await variableSchema.findOne({ organization_id });
    //convert variables to json
    variables = variables?.toObject();
    if (variables) {
      variables.data.forEach((element: any) => {
        delete element._id;
      });
      return variables.data;
    } else {
      return [];
    }
  }

  async deleteVariables(organization_id: string) {
    await variableSchema.deleteOne({ organization_id });
  }
}

export { Variable, variableSchema };
