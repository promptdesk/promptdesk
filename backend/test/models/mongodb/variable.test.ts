import request from "supertest";
import "../../../src/models/mongodb/db";
import { Variable } from "../../../src/models/mongodb/variable";
import { Organization } from "../../../src/models/mongodb/organization";
import { expect } from "chai";
import { describe, it } from "mocha";

describe("Variable tests", () => {
  const variable_db = new Variable();
  const organization_db = new Organization();
  let organization: any;
  let variable: any;

  // Set up initial data before running tests
  before(async () => {
    organization = await organization_db.addOrganization();
    variable = { data: [{ name: "Variable1", value: "Value1" }] };
    const response = await variable_db.createVariables(
      variable.data,
      organization.id,
    );
    variable.id = response;
  });

  after(async () => {
    await organization_db.removeOrganization(organization.id);
  });

  it("should create a variable", async () => {
    expect(variable.id).to.be.a("string");
  });

  it("should find a variable", async () => {
    const response = await variable_db.getVariables(organization.id);
    expect(response).to.not.equal(null);
    expect(response).to.be.a("array");
  });

  it("should update a variable", async () => {
    const newData = [{ name: "UpdatedVariable", value: "UpdatedValue" }];
    await variable_db.updateVariables(newData, organization.id);
    const updatedVariable = await variable_db.getVariables(organization.id);
    expect(updatedVariable[0].name).to.equal(newData[0].name);
  });

  it("should remove all variables", async () => {
    await variable_db.deleteVariables(organization.id);
    const response = await variable_db.deleteVariables(organization.id);
    expect(response).to.equal(undefined);
  });
});
