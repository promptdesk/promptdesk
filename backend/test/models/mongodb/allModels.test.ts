//not running due to errors

import request from "supertest";
import { expect } from "chai";
import { describe, it } from "mocha";
import {
  Organization,
  Log,
  Model,
  Prompt,
  Variable,
} from "../../../src/models/allModels";

describe("allModels", function () {
  it("should initiate each object in allModels", function () {
    let organization = new Organization();
    let log = new Log();
    let model = new Model();
    let prompt = new Prompt();
    let variable = new Variable();

    expect(organization).to.exist;
    expect(log).to.exist;
    expect(model).to.exist;
    expect(prompt).to.exist;
    expect(variable).to.exist;
  });
});
