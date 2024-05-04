import { useState } from "react";
import blogService from "../services/blogs";
import PropTypes from "prop-types";

const BlogForm = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleNewBlog = async (event) => {
    event.preventDefault();
    try {
      const blog = await blogService.create({ title, author, url });
      props.setBlogs(props.blogs.concat(blog));
      props.blogFormRef.current.toggleVisibility();
      props.setMsg(`a new blog ${blog.title} by ${blog.author} added `);
      setTimeout(() => {
        props.setMsg("");
      }, 5000);
    } catch (error) {
      console.error("error", error);
      props.setErrorMsg("a new blog added failed");
      setTimeout(() => {
        props.setErrorMsg("");
      }, 5000);
    }
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog} className="blogForn">
        <div>
          title:{" "}
          <input
            id="title"
            name="title"
            aria-label="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          ></input>
        </div>
        <div>
          author:{" "}
          <input
            id="author"
            name="author"
            aria-label="author"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
            }}
          ></input>
        </div>
        <div>
          url:{" "}
          <input
            id="url"
            name="url"
            aria-label="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          ></input>
        </div>
        <button id="blog-button">create</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  setBlogs: PropTypes.func.isRequired,
  setMsg: PropTypes.func.isRequired,
  setErrorMsg: PropTypes.func.isRequired,
  blogs: PropTypes.object.isRequired,
  blogFormRef: PropTypes.func.isRequired,
};

export default BlogForm;
