import mongoose from "mongoose";
import {modelSchema} from './model';
import {Prompt as mongoPrompt, promptSchema} from './prompt';

const logSchema = mongoose.model(
  'Log',
  new mongoose.Schema(
    {
      message: mongoose.Schema.Types.Mixed,
      raw: mongoose.Schema.Types.Mixed,
      data: mongoose.Schema.Types.Mixed,
      error: Boolean,
      status: Number,
      model_id: String,
      prompt_id: String,
      organization_id: String,
      duration: Number
    },
    {
      timestamps: true
    }
  )
);

class Log {
  async createLog(logData: any, organization_id: string) {

    var isValidId = mongoose.isValidObjectId(logData.prompt_id)

    if(!isValidId) {
      logData.prompt_id = undefined
    }

    //add organization_id to logData
    logData.organization_id = organization_id;
    const log = new logSchema(logData);
    await log.save();
    return log._id.toString();
  }

  async findLog(id: any, organization_id: string) {
    const log = await logSchema.findOne({ _id: id, organization_id });
    return log ? this.transformLog(log) : null;
  }

  async getLogDetails(organization_id: string) {

    const model_names = await modelSchema.find({ organization_id }, { name: 1, _id: 1 });

    const prompt_names = await promptSchema.find({ organization_id }, { name: 1, _id: 1 });

    //get number of unique models
    let models = await logSchema.distinct("model_id", { organization_id });
    
    //get number of unique prompts
    let prompts = await logSchema.distinct("prompt_id", { organization_id });

    //get number of unique status codes
    let statusCodes = await logSchema.distinct("status", { organization_id });

    //convert models to list of {name: model_id, value: model_id}
    models = models.map((model: any) => {
      let model_obj = model_names.find((model_name: any) => model_name._id.toString() === model)
      var name = model
      if(model_obj && model_obj.name) {
        name = model_obj.name
      }
      return {
        name: name,
        value: model
      }
    });

    //convert prompts to list of {name: prompt_id, value: prompt_id}
    prompts = prompts.map((prompt: any) => {
      let prompt_obj = prompt_names.find((prompt_name: any) => prompt_name._id.toString() === prompt)
      var name = prompt
      if(prompt_obj && prompt_obj.name) {
        name = prompt_obj.name
      }
      return {
        name: name,
        value: prompt
      }
    });

    //convert statusCodes to list of {name: status, value: status}
    statusCodes = statusCodes.map((status: any) => {
      return {
        name: status,
        value: status
      }
    });

    return {
      models: models,
      prompts: prompts,
      statusCodes: statusCodes
    }

  }

  async getLogs(page:any, limit = 10, organization_id: string, prompt_id?: string, model_id?: string, status?: number) {

    let query = {
      organization_id
    } as any;

    if (model_id) {
      query.model_id = model_id;
    }

    if (prompt_id) {
      query.prompt_id = prompt_id;
    }

    if(prompt_id === 'undefined') {
      query.prompt_id = undefined
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    let logs = await logSchema.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by descending order of creation time
      
    logs = logs.map(this.transformLog)

    const count = await logSchema.countDocuments(query);
    const average = await logSchema.aggregate([
      { $match: query },
      { $group: { _id: null, average: { $avg: "$duration" } } }
    ]);

    let all200 = 0;
    if(!query.status || query.status === 200) {
      query.status = 200;
      all200 = await logSchema.countDocuments(query);
    }

    let averageValue = 0;
    if(average.length > 0) {
      averageValue = average[0].average
    }


    return {
      page: page,
      per_page: limit,
      total: count,
      total_pages: Math.ceil(count / limit),
      data: logs,
      stats: [
        { name: 'Total Responses', stat: count },
        { name: 'Avg. Response Time', stat: averageValue.toFixed(2) },
        { name: 'Success Rate', stat: ((all200 / count) * 100).toFixed(0) + '%' }
      ]
    }
  
  }

  transformLog(log:any) {
    const transformedLog = log.toObject();
    transformedLog.id = transformedLog._id.toString();
    delete transformedLog._id;
    return transformedLog;
  }
}

export { Log, logSchema }