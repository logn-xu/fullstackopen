const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");
const helper = require("../tests/test_help.test");

describe("User test case", async () => {
  //   beforeEach(() => {
  //     const initUser = {
  //       username: "logn",
  //       name: "logn",
  //       password: "lognlogn",
  //     };
  //   });
  test("username length < 3", async () => {
    const errorUserName = {
      username: "co",
      name: "cow is cow",
      password: "cowcow",
    };
    await api.post("/api/user").send(errorUserName).expect(400);
  });

  test("password length < 3", async () => {
    const errorUserName = {
      username: "cow",
      name: "cow is cow",
      password: "cow",
    };
    await api.post("/api/user").send(errorUserName).expect(400);
  });

  test("username is exist", async () => {
    const initUser = {
      username: "exec",
      name: "execs",
      password: "execexec",
    };

    const user = new User(initUser);
    const savedUser = await user.save();
    console.log("id", savedUser.id);

    await api
      .post("/api/user/")
      .send(initUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    await User.findByIdAndDelete(savedUser.id);
  });
});

after(async () => {
  await mongoose.connection.close();
});
