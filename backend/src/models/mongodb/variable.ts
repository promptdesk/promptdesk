import mongoose from "mongoose";

const variableSchema = mongoose.model(
  'Variable',
  new mongoose.Schema({
    data: [
      {
        name: String,
        value: String,
      }
    ]
  }, {
    timestamps: true
  })
);

class Variable {
  async createVariables(data_list:any) {
    const prompt = new variableSchema({
      data: data_list
    });
    await prompt.save();
    return prompt._id.toString();
  }

  async updateVariables(data_list: any) {
    const variables = await variableSchema.findOne();
    const id = variables?._id;
    await variableSchema.findByIdAndUpdate(id, {
      data: data_list
    });
  }

  async getVariables() {
    var variables:any = await variableSchema.findOne();
    //convert variables to json
    variables = variables?.toObject();
    if (variables) {
      variables.data.forEach((element:any) => {
        delete element._id;
      });
      return variables.data;
    } else {
      return []
    }
  }

  async deleteVariables() {
    //remove all variables
    await variableSchema.deleteMany({});

  }

}

export { Variable }