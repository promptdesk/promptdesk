import mongoose from "mongoose";

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
    },
    {
      timestamps: true
    }
  )
);

class Log {
  async createLog(logData: any, organization_id: string) {
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

  async getLogs(page:any, limit = 10, organization_id: string) {

    const skip = (page - 1) * limit;
    const logs = await logSchema.find({ organization_id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by descending order of creation time
    return logs.map(this.transformLog);
  }

  transformLog(log:any) {
    const transformedLog = log.toObject();
    transformedLog.id = transformedLog._id.toString();
    delete transformedLog._id;
    return transformedLog;
  }
}

export { Log, logSchema }