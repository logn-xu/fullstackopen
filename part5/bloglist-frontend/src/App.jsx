import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import { Notification, ErrorNotification } from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./index.css";
import _ from "lodash";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const blogFormRef = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      window.localStorage.setItem("loginUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
      blogService.setToken(user.token);
      setMsg("Login secuess");
      setTimeout(() => {
        setMsg("");
      }, 5000);
    } catch (error) {
      console.error("wrong credentials");
      setErrorMsg(error.message);
      setTimeout(() => {
        setErrorMsg("");
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loginUser");
    setUser(null);
  };

  const handleLike = async (blog) => {
    try {
      const newLikes = await blogService.addLike(blog);
      const newBlogs = blogs.map((blog) => {
        return blog.id !== newLikes.id
          ? blog
          : {
              ...blog,
              likes: newLikes.likes,
            };
      });

      const sortedBlogs = _.sortBy(newBlogs, (b) => -b.likes);
      setBlogs(sortedBlogs);
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.removeBlog(blog);
      const removedBlogs = blogs.filter((b) => b.id !== blog.id);
      setBlogs(removedBlogs);
    }
  };

  const loginForm = () => (
    <div>
      <h2>login to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username{" "}
          <input
            id="username"
            type="text"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
        </div>
        <div>
          password{" "}
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  );

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => {
        console.log("blogs", blogs);
        const sortedBlogs = _.sortBy(blogs, (b) => -b.likes);
        console.log("sortblogs", sortedBlogs);
        setBlogs(sortedBlogs);
      });

      // console.log("blogs", blogs);
      // setBlogs(blogs);
    }
  }, [user]);

  useEffect(() => {
    const user = window.localStorage.getItem("loginUser");
    if (user) {
      const userJosnStr = JSON.parse(user);
      setUser(userJosnStr);
      blogService.setToken(userJosnStr.token);
    }
  }, []);

  const blogsForm = () => {
    return (
      <div>
        <h2>blogs</h2>
        <form onSubmit={handleLogout}>
          <p>
            {user.username} logged in<button>logout</button>
          </p>
        </form>
        <Togglable buttonLabel="new note" ref={blogFormRef}>
          <BlogForm
            handleLogout={handleLogout}
            user={user}
            blogs={blogs}
            setBlogs={setBlogs}
            setMsg={setMsg}
            setErrorMsg={setErrorMsg}
            blogFormRef={blogFormRef}
            blogService={blogService}
          />
        </Togglable>
        {blogs.map((blog) =>
          blog.user.username === user.username ? (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleRemove={handleRemove}
              showRemove={{ display: "none" }}
            />
          ) : (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleRemove={handleRemove}
              showRemove={{ display: "" }}
            />
          )
        )}
      </div>
    );
  };

  return (
    <div>
      {errorMsg !== "" && (
        <ErrorNotification message={errorMsg}></ErrorNotification>
      )}
      {msg !== "" && <Notification message={msg}></Notification>}

      {user === null ? loginForm() : blogsForm()}
    </div>
  );
};

export default App;
