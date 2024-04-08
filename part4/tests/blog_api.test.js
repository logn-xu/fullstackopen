const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const helper = require("../tests/test_help.test");

const getToken = async () => {
  const user = {
    username: "admin",
    password: "cowcow",
  };
  const response = await api.post("/api/login").send(user);
  return response.body.token;
};

test("blogs are returned as json", async () => {
  const token = await getToken();
  await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blogs uniq is id", async () => {
  const token = await getToken();
  const blogs = (
    await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
  ).body;
  blogs.forEach((blog) => {
    assert.ok(blog.hasOwnProperty("id"));
    assert.ok(!blog.hasOwnProperty("_id"));
  });
});

test("blog test added", async () => {
  const token = await getToken();
  const testBlog = {
    title: "This is test blog hihi",
    author: "Logn",
    url: "http://localhost/test/blog",
    likes: 6,
  };

  await api
    .post("/api/blogs")
    .send(testBlog)
    .set("Authorization", `Bearer ${token}`)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const blogAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogAtEnd.length, helper.initBlogs.length + 1);
});

test("blog test added by default liked", async () => {
  const token = await getToken();
  const testBlog = {
    title: "This is test blog not have liked",
    author: "Logn",
    url: "http://localhost/test/blog",
  };

  const savedTestBlog = await api
    .post("/api/blogs")
    .send(testBlog)
    .set("Authorization", `Bearer ${token}`)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(savedTestBlog.body.likes, 0);
});

test("blog test added no title or url", async () => {
  const token = await getToken();
  const testBlog = [
    {
      title: "This is test blog no url",
      author: "Logn",
      likes: 6,
    },
    {
      author: "Logn",
      url: "http://localhost/test/no_title",
      likes: 6,
    },
  ];

  const blogObject = testBlog.map((blog) => new Blog(blog));

  const promises = blogObject.map(async (blog) => {
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog)
      .expect(400);
    return response;
  });
  await Promise.all(promises);
});

test("blogs delete by id", async () => {
  const token = await getToken();
  const id = await helper.addedBlogOneInDb();
  await api
    .delete(`/api/blogs/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);
});

test("blogs update liked by id", async () => {
  const token = await getToken();
  const id = await helper.addedBlogOneInDb();
  console.log("id", id);
  const newLike = {
    likes: 99,
  };

  const newLiked = await api
    .put(`/api/blogs/${id}`)
    .send(newLike)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
  assert.strictEqual(newLiked.body.likes, newLike.likes);
});

test("blog test added not token", async () => {
  const testBlog = {
    title: "This is test blog hihi",
    author: "Logn",
    url: "http://localhost/test/blog",
    likes: 6,
  };

  await api
    .post("/api/blogs")
    .send(testBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);
  const blogAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogAtEnd.length, helper.initBlogs.length);
});

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObject = helper.initBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObject.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

after(async () => {
  await mongoose.connection.close();
  process.exit(0);
});
