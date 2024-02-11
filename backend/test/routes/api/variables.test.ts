import request from "supertest";
import app from "../../../src/index"; // Adjust the path as needed
import { Variable } from "../../../src/models/mongodb/variable"; // Adjust the path to the Variable model
import { Organization } from "../../../src/models/mongodb/organization"; // Adjust the path to the Variable model
import { expect } from "chai";
import { describe, it, before, after } from "mocha";

describe("Variable API", function () {
  this.timeout(10000); // Set timeout to 10 seconds for all tests in this describe block

  const variableDbInstance = new Variable();
  const organization_db = new Organization();
  let organization: any;
  let token: any;

  // Test data
  const initialVariableData = {
    data: [
      {
        name: "Variable1",
        value: "Value1",
      },
    ],
  };

  // Set up initial data before running tests
  before(async () => {
    organization = await organization_db.addOrganization();
    token = organization.keys[0].key;
    await variableDbInstance.createVariables(
      initialVariableData.data,
      organization.id,
    );
  });

  // Clean up data after running tests
  after(async () => {
    await variableDbInstance.deleteVariables(organization.id);
    await organization_db.removeOrganization(organization.id);
  });

  it("should respond with 200 and the variable JSON on GET /variables", async function () {
    const res = await request(app)
      .get("/api/variables")
      .set("Authorization", "Bearer " + token);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should update the variable and respond with 200 on PUT /variables", async function () {
    const updatedVariableData = {
      // Updated variable data here
    };

    const res = await request(app)
      .put("/api/variables")
      .send(updatedVariableData)
      .set("Authorization", "Bearer " + token);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "message",
      "Variable updated successfully",
    );
  });
});
