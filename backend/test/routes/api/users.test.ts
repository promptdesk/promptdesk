import request from "supertest";
import app from "../../../src/index"; // Adjust the path as needed
import { expect } from "chai";
import { describe, it } from "mocha";
import { Organization } from "../../../src/models/mongodb/organization";
import { User } from "../../../src/models/mongodb/user";

describe("Users API", function () {
  this.timeout(10000);
  let token = "";

  const USER_ENDPOINT = "/api/users";

  const organization_db = new Organization();
  const user_db = new User();
  let organizationId = "";

  const getEmail = (prefix?: string): string => {
    return `${prefix || "user"}+${Date.now().valueOf()}@email.com`;
  };
  let users_emails: string[] = [];

  before(async () => {
    const organization = await organization_db.getOrganization();
    organizationId = organization.id;
    token = organization.keys[0].key;
  });

  afterEach(async () => {
    await user_db.deleteUsers(users_emails);
    users_emails = [];
  });

  const getUsersForOrganization = async (orgKey: string): Promise<any[]> => {
    const users = await user_db
      .findUsersByOrganizationId(orgKey)
      .then((res) => res);
    return users;
  };

  const createUserInOrganization = async (
    email: string,
    token: string,
  ): Promise<any> => {
    const res = await request(app)
      .post(USER_ENDPOINT)
      .send({ email })
      .set("Authorization", "Bearer " + token);
    expect(res.statusCode).to.equal(201);
    users_emails.push(email);
    return res;
  };

  it("should be able to create the user", async function () {
    const val = Date.now().valueOf();

    const email = getEmail();
    const res = await request(app)
      .post(USER_ENDPOINT)
      .send({ email })
      .set("Authorization", "Bearer " + token);

    expect(res.statusCode).to.equal(201);
    users_emails.push(email);

    const users = await getUsersForOrganization(organizationId);

    // one admin user + created user
    expect(users.filter((user) => user.email === email).length).to.equal(1);
  });

  it("should not be able to create the user with existing user's email", async function () {
    const email = getEmail();
    await createUserInOrganization(email, token);

    const createUserResponse = await request(app)
      .post(USER_ENDPOINT)
      .send({ email })
      .set("Authorization", "Bearer " + token);

    expect(createUserResponse.statusCode).to.equal(400);
  });

  it("should return error if email is not passed in the request", async function () {
    const createUserRes = await request(app)
      .post(USER_ENDPOINT)
      .set("Authorization", "Bearer " + token);

    expect(createUserRes.statusCode).to.equal(400);
  });

  it("should get users by organization", async function () {
    let usersForOrganizationRes = await request(app)
      .get(USER_ENDPOINT)
      .set("Authorization", "Bearer " + "fake organization token");
    expect(usersForOrganizationRes.statusCode).to.equal(401);

    usersForOrganizationRes = await request(app)
      .get(USER_ENDPOINT)
      .set("Authorization", "Bearer " + token);

    expect(usersForOrganizationRes.statusCode).to.equal(200);

    // create some users
    let user1Email = getEmail();
    let user2Email = getEmail("t");

    await createUserInOrganization(user1Email, token);
    await createUserInOrganization(user2Email, token);

    const usersInOrgRes = await request(app)
      .get(USER_ENDPOINT)
      .set("Authorization", "Bearer " + token);

    expect(usersInOrgRes.statusCode).to.equals(200);
    expect(usersInOrgRes.body).to.have.property("users");
    expect(
      usersInOrgRes.body.users.map((user: any) => user.email),
    ).to.include.members([user1Email, user2Email]);
  });

  it("should be able to reset the password", async function () {
    const val = Date.now().valueOf();

    const email = `user+${val}@email.com`;
    const res = await request(app)
      .post(USER_ENDPOINT)
      .send({ email })
      .set("Authorization", "Bearer " + token);

    expect(res.body).to.have.property("created_password");
    const assignedPassword = res.body.created_password;

    const passwordResetRes = await request(app)
      .post(`${USER_ENDPOINT}/reset`)
      .send({ email })
      .set("Authorization", "Bearer " + token);

    expect(passwordResetRes.statusCode).to.equal(200);
    expect(passwordResetRes.body).to.have.property("password");

    const newPassword = passwordResetRes.body?.password;
    expect(assignedPassword).not.equals(newPassword);

    users_emails.push(email);
  });

  it("should return 404 if we reset password for user that doesn't exist", async function () {
    const email = getEmail();

    await createUserInOrganization(email, token);

    users_emails.push(email);

    const passwordResetRes = await request(app)
      .post(`${USER_ENDPOINT}/reset`)
      .send({ email: "not@email.com" })
      .set("Authorization", "Bearer " + token);
    expect(passwordResetRes.statusCode).to.equal(404);
  });

  it("should be able to delete the user", async function () {
    const email = getEmail();

    await createUserInOrganization(email, token);

    const deleteUserRes = await request(app)
      .delete(`${USER_ENDPOINT}`)
      .send({ email })
      .set("Authorization", "Bearer " + token);

    expect(deleteUserRes.statusCode).to.equal(200);

    const usersInOrg = await getUsersForOrganization(organizationId);

    expect(usersInOrg.map((user: any) => user.email)).not.include.members([
      email,
    ]);
  });

  it("should not be able to delete the user that doesn't exist", async function () {
    const email = getEmail();

    await createUserInOrganization(email, token);
    const deleteUserRes = await request(app)
      .delete(`${USER_ENDPOINT}`)
      .send({ email: "invalid@email.com" })
      .set("Authorization", "Bearer " + token);

    expect(deleteUserRes.statusCode).to.equal(404);
  });
});
