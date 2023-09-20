import mongoose from "mongoose";

const logSchema = mongoose.model(
  'Log',
  new mongoose.Schema(
    {
      message: mongoose.Schema.Types.Mixed,
      raw_response: mongoose.Schema.Types.Mixed,
      raw_request: mongoose.Schema.Types.Mixed,
      status: Number,
      model_id: String,
      prompt_id: String
    },
    {
      timestamps: true
    }
  )
);

export default class Log {
  async createLog(logData) {
    const log = new logSchema(logData);
    await log.save();
    return log._id.toString();
  }

  async findLog(id) {
    const log = await logSchema.findById(id);
    return log ? this.transformLog(log) : null;
  }

  async getLogs(page, limit = 10) {
    const skip = (page - 1) * limit;
    const logs = await logSchema.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by descending order of creation time
    return logs.map(this.transformLog);
  }

  transformLog(log) {
    const transformedLog = log.toObject();
    transformedLog.id = transformedLog._id.toString();
    delete transformedLog._id;
    return transformedLog;
  }
}