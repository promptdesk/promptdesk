import "../../../src/models/mongodb/db";
import { Organization } from "../../../src/models/mongodb/organization";
import { expect } from "chai";
import { describe, it } from "mocha";

describe("Mongodb tests for Organization", () => {
  const organization_db = new Organization();
  let organization: any = {};

  it("should add organization", async () => {
    organization = await organization_db.addOrganization();
    expect(organization.id).to.be.a("string");
  });

  it("should get organization", async () => {
    organization = await organization_db.getOrganizationById(organization.id);
    expect(organization.name).to.be.a("string");
  });

  it("should remove organization", async () => {
    const response = await organization_db.removeOrganization(organization.id);
    expect(response).to.equal(organization.id);
  });
});
