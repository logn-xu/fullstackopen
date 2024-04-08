const _ = require("lodash");
const dummy = (blogs) => {
  // ...
  return 1;
};

const totalLikes = (blogs) => {
  const callbackFn = (sum, blog) => {
    return sum + blog.likes;
  };
  return blogs.length === 0 ? 0 : blogs.reduce(callbackFn, 0);
};

const favoriteBlog = (blogs) => {
  let maxIndex = 0;
  blogs.forEach((blog, index) => {
    maxIndex = blog.likes > blogs[maxIndex].likes ? index : maxIndex;
  });
  console.log("blog most likes", blogs[maxIndex].likes);
  console.log("maxIndex", maxIndex);
  return blogs[maxIndex];
};

const mostBlogs = (blogs) => {
  const mostResult = _.countBy(blogs, "author");
  const mostArray = _.maxBy(Object.entries(mostResult), 1);
  return _.zipObject(["author", "blogs"], mostArray);
};

const mostLikes = (blogs) => {
  // group by author
  const authorCount = _.groupBy(blogs, "author");

  // sum likes
  const authorSum = _.mapValues(authorCount, (o) => {
    return _.sumBy(o, "likes");
  });
  // max likes
  maxLikes = _.maxBy(Object.entries(authorSum), 1);
  // build object
  return _.zipObject(["author", "likes"], maxLikes);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
