const request = require("supertest");
const app = require("../../app");
const { validationMiddleware, ctrlWrapper } = require("../../middlewares");
const { joiLoginSchema, User } = require("../../models");
const { login } = require("./authControllers");

app.use(validationMiddleware(joiLoginSchema));
app.post("/api/users/login", ctrlWrapper(login));

describe("test login controller", () => {
  test("login return status code 200", async () => {
    const req = {
      body: {
        email: "user1@mail.com",
        password: "user1",
        subscription: "starter",
      },
    };

    const user = {
      _id: "64090b1f26b5b667b97ffe47",
      email: "user1@mail.com",
      subscription: "starter",
      password: "$2a$10$vPTgs5JBYQaQ4dtZhbSiXukk3Wz4m6HKkZsrs/DzJKxQ7C.UIH5za",
      avatarURL: "//www.gravatar.com/avatar/5f129ed2b44dcd438c6d44938ee85137",
    };

    jest.spyOn(User, "findOne").mockImplementationOnce(async () => user);

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MGE0ZmIzM2EwMGRjYjBjM…";

    const updateUser = {
      _id: "640a4fb33a00dcb0c1e34591",
      email: "user3@mail.com",
      subscription: "business",
      password: "$2a$10$Cna4UPurCKwxHCYv11RWf.vRVMEISSL6hr3h7N4UHnuuamXP.VcuS",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MGE0ZmIzM2EwMGRjYjBjM…",
      avatarURL: "//www.gravatar.com/avatar/5f129ed2b44dcd438c6d44938ee85137",
    };

    jest
      .spyOn(User, "findByIdAndUpdate")
      .mockImplementationOnce(async () => updateUser);

    return request(app)
      .post("/api/users/login")
      .send({
        email: "user1@mail.com",
        password: "user1",
      })
      .then((response) => {
        const token = response._body.data.token;
        const user = response._body.data.user;

        expect(response.status).toBe(200);
        expect(token).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.subscription).toBeDefined();
        expect(typeof user.email).toBe("string");
        expect(typeof user.subscription).toBe("string");
      });
  });
});
