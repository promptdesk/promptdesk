import { expect } from "chai";
import { describe, it } from "mocha";
import app from "../../src/index";
import request from "supertest";

describe("Initial Test", () => {
  it("should ping server successfully", async function () {
    this.timeout(20000);
    const res = await request(app).get("/ping");
    await new Promise((r) => setTimeout(r, 5000));
  });
});
