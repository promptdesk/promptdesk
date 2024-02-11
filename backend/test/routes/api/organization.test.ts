import request from "supertest";
import app from "../../../src/index"; // Adjust the path as needed
import { Organization } from "../../../src/models/mongodb/organization"; // Adjust the path to the Variable model
import { expect } from "chai";
import { describe, it, before, after } from "mocha";

describe("Organization API", function () {
  this.timeout(10000); // Set timeout to 10 seconds for all tests in this describe block

  const organizationDbInstance = new Organization();
  var organization: any = {};
  let token: any;

  // Set up initial data before running tests
  before(async () => {
    organization = await organizationDbInstance.addOrganization();
    token = organization.keys[0].key;
  });

  it("should respond with 200 and the organization JSON object on GET /organization", async function () {
    const res = await request(app)
      .get("/api/organization")
      .set("Authorization", "Bearer " + token);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("object");
  });

  it("should delete the organization and respond with 200 on DELETE /organization", async function () {
    const res = await request(app)
      .delete(`/api/organization/${organization.id}`)
      .set("Authorization", "Bearer " + token);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "message",
      "Organization deleted successfully",
    );
  });
});
