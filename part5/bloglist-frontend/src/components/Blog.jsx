import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, handleLike, handleRemove, showRemove }) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blogDisplay">
      <div style={hideWhenVisible} className="hideBlog">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className="showBlog">
        <li>
          {blog.title}
          <button onClick={toggleVisibility}>hide</button>
        </li>
        <li>{blog.url}</li>
        <li>
          {blog.likes}
          <button onClick={() => handleLike(blog)}>like</button>
        </li>
        <li>{blog.author}</li>
        <div style={showRemove}>
          <button id="remove-button" onClick={() => handleRemove(blog)}>
            remove
          </button>
        </div>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  showRemove: PropTypes.object.isRequired,
};

export default Blog;
