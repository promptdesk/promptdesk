import request from "supertest";
import app from "../../../src/index";
import { expect } from "chai";
import { describe, it } from "mocha";
import { Model } from "../../../src/models/mongodb/model";
import { Organization } from "../../../src/models/mongodb/organization";
import { Prompt } from "../../../src/models/mongodb/prompt";

var fs = require("fs");
var path = require("path");

describe("Magic API", async () => {
  const model_db = new Model();
  let prompt: any;
  let model_id: any;
  let model: any;
  let organization: any;
  let token: any;
  const organization_db = new Organization();
  const prompt_db = new Prompt();

  before(async () => {
    organization = await organization_db.getOrganization();
    token = organization.keys[0].key;

    prompt = await prompt_db.findPromptByName("yoda-test", organization.id);
    let modelId = prompt.model;
    model = await model_db.findModel(modelId, organization.id);
  });

  after(async () => {
    await model_db.deleteModel(model_id, organization.id);
  });

  it("should respond with 200 on POST /api/generate", async function () {
    this.timeout(10000); // Set timeout to 10 seconds

    const res = await request(app)
      .post("/api/generate")
      .send(prompt)
      .set("Authorization", "Bearer " + token);

    expect(res.status).to.equal(200);

    //expect the following keys to be present in the response body
    expect(res.body).to.have.property("data");
    expect(res.body).to.have.property("message");
    expect(res.body).to.have.property("error");
    expect(res.body).to.have.property("raw");
    expect(res.body).to.have.property("status");
    expect(res.body).to.have.property("model_id");
    expect(res.body).to.have.property("organization_id");
    //expect(res.body).to.have.property('prompt_id'); //no id since none created
  });
});
