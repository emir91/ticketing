import request from "supertest";
import { app } from "../../app";
import { signupHelper } from "../test-utils/signup-helper";

describe("Signout test suite", () => {
  test("signout logic", async () => {
    const authResponse = await signupHelper();

    const response = await request(app)
      .post("/api/users/signout")
      .set("Cookie", authResponse)
      .send({})
      .expect(200);

    expect(response.body).toEqual({});
  });
});
