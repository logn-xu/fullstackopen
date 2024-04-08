const Blog = require("../models/blog");

const initBlogs = [
  {
    title: "This is test blog",
    author: "Logn",
    url: "http://localhost/test/blog",
    likes: 10,
  },
  {
    title: "This is test blog 2",
    author: "Xu",
    url: "http://localhost/test/blog2",
    likes: 16,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const addedBlogOneInDb = async () => {
  const blog = new Blog({
    title: "add a blog in db return ID",
    author: "Logn Xu",
    url: "http://localhost/test/ID",
    likes: 18,
    user: "660cf9696f3b701bd70f3529",
  });
  await blog.save();
  return blog.id.toString();
};

module.exports = {
  initBlogs,
  blogsInDb,
  addedBlogOneInDb,
};
