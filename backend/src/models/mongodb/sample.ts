import mongoose from "mongoose";
import crypto from 'crypto';
const canonicaljson = require('canonical-json');

const schema = new mongoose.Schema(
    {
        variables: mongoose.Schema.Types.Mixed,
        result: String,
        hash: String,
        prompt_id: String,
        organization_id: String,
    },
    {
        timestamps: true
    }
)

schema.index({organization_id: 1, prompt_id: 1, hash: 1}, {unique: true});

const sampleSchema = mongoose.model(
    'Sample',
    schema,
);

class Sample {
    async recordSampleDataIfNeeded(variables: any, result: string, prompt_id: string, organization_id: string) {
        // Compute the hash for the sample using sha256.
        // Use canonical json to ensure that the hash is
        // consistent even if values in the json get reordered.
        const hashJsonString = canonicaljson.stringify(variables);
        const hash = crypto.createHash('sha256').update(hashJsonString).digest('hex');

        const newSample = {
            variables: variables,
            result: result,
            hash: hash,
            prompt_id: prompt_id,
            organization_id: organization_id,
        }

        // Upsert the sample if there isn't already a sample for this prompt and hash
        await sampleSchema.findOneAndUpdate({hash, prompt_id, organization_id}, {$set: newSample}, {upsert: true});
    }

    async getSamples(page: any, limit = 10, organization_id: string, prompt_id: string) {
        let query = {
            organization_id,
            prompt_id,
        } as any;

        const skip = (page - 1) * limit;
        let samples = await sampleSchema.find(query)
            .skip(skip)
            .limit(limit)
            .sort({createdAt: -1}); // Sort by descending order of creation time

        samples = samples.map(this.transformSample)

        const count = await sampleSchema.countDocuments(query);

        return {
            page: page,
            per_page: limit,
            total: count,
            total_pages: Math.ceil(count / limit),
            data: samples
        }

    }

    transformSample(sample: any) {
        const transformedSample = sample.toObject();
        transformedSample.id = transformedSample._id.toString();
        delete transformedSample._id;
        return transformedSample;
    }
}

export {Sample, sampleSchema}
