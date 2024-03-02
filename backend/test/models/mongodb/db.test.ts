import { expect } from "chai";
import { describe, it } from "mocha";
import mongoose from "mongoose";
import request from "supertest";
import connectToDatabase from "../../../src/models/mongodb/db";
import { automaticTestEnvironmentSetup } from "../../../src/utils/inititialize";

describe("MongoDB Database Connection", () => {
  before(async () => {
    await mongoose.connection.close();
  });

  it("should successfully connect to the database", async function () {
    (this as Mocha.Context).timeout(30000);
    const result = await connectToDatabase(true);
    expect(result).to.equal("CONNECTED");
  });
});
