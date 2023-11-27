import mongoose from "mongoose";
import crypto from 'crypto';
import {canonical_json_stringify} from "../../utils/canonicalJson";

const schema = new mongoose.Schema(
    {
        variables: mongoose.Schema.Types.Mixed,
        prompt: mongoose.Schema.Types.Mixed,
        result: String,
        hash: String,
        status: String,
        sort_order: Number,
        prompt_id: String,
        organization_id: String,
    },
    {
        timestamps: true
    }
)

schema.index({organization_id: 1, prompt_id: 1, hash: 1}, {unique: true});
schema.index({organization_id: 1, prompt_id: 1, sort_order: 1, createdAt: 1});

const sampleSchema = mongoose.model(
    'Sample',
    schema,
);

class Sample {
    async recordSampleDataIfNeeded(variables: any, prompt: any, result: string, prompt_id: string, organization_id: string) {
        // Compute the hash for the sample using sha256.
        // Use canonical json to ensure that the hash is
        // consistent even if values in the json get reordered.
        const hashJsonString = canonical_json_stringify(variables);
        const hash = crypto.createHash('sha256').update(hashJsonString).digest('hex');

        const newSample = {
            variables: variables,
            prompt: prompt,
            result: (result as any).content || result,
            hash: hash,
            status: "new",
            sort_order: 0,
            prompt_id: prompt_id,
            organization_id: organization_id,
        }

        // Upsert the sample if there isn't already a sample for this prompt and hash
        await sampleSchema.findOneAndUpdate({hash, prompt_id, organization_id}, {$setOnInsert: newSample}, {upsert: true});
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
            .sort({sort_order: 1, createdAt: -1}); // First sort by status, then by creation time so most recent shows up first.

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

    async patchSample(sample_id: string, changes: any, organization_id: string) {
        if (changes.status === 'new') {
            changes.sort_order = 0;
        }
        else if (changes.status === 'in_review') {
            changes.sort_order = 1;
        }
        else if (changes.status === 'approved') {
            changes.sort_order = 2;
        }
        else if (changes.status === 'rejected') {
            changes.sort_order = 3;
        }

        await sampleSchema.findOneAndUpdate({ _id: sample_id, organization_id }, {$set: changes});
    }

    async deleteSample(id:any, organization_id:string) {
        await sampleSchema.findOneAndDelete({ _id: id, organization_id });
        return id;
    }

    transformSample(sample: any) {
        const transformedSample = sample.toObject();
        transformedSample.id = transformedSample._id.toString();
        delete transformedSample._id;
        return transformedSample;
    }
}

export {Sample, sampleSchema}
