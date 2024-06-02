import request from "supertest";
import app from "../../../src/index";
import { expect } from "chai";
import { describe, it } from "mocha";
import { Model } from "../../../src/models/mongodb/model";
import { Organization } from "../../../src/models/mongodb/organization";

describe.skip("Embedding API", async () => {
  const model_db = new Model();
  let model_id: any;
  let model: any;
  let organization: any;
  let token: any;
  const organization_db = new Organization();

  before(async () => {
    organization = await organization_db.getOrganization();
    token = organization.keys[0].key;
  });

  after(async () => {
    await model_db.deleteModel(model_id, organization.id);
  });

  it("should respond with 200 on POST /api/embed", async function () {
    this.timeout(10000); // Set timeout to 10 seconds

    let body = {
      model_name: "openai-3-small",
      text_list: ["I am a software engineer"],
    };

    const res = await request(app)
      .post("/api/embed")
      .send(body)
      .set("Authorization", "Bearer " + token);

    expect(res.status).to.equal(200);
  });
});
