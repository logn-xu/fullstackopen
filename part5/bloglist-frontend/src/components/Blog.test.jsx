import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect, vi } from "vitest";

test("renders hideBlog", () => {
  const blog = {
    title: "this is a test blog",
    author: "Logn Xu",
    url: "http://localhost/hahaha",
    likes: 89,
  };

  const { container } = render(<Blog blog={blog} />);

  const div = container.querySelector(".hideBlog");

  expect(div).toHaveTextContent("this is a test blog");
  expect(div).toHaveTextContent("Logn Xu");
  expect(div).not.toHaveTextContent("http://localhost/hahaha");
  expect(div).not.toHaveTextContent(89);
});

test("renders showBlog", async () => {
  const blog = {
    title: "this is a test blog",
    author: "Logn Xu",
    url: "http://localhost/hahaha",
    likes: 89,
  };

  const { container } = render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const div = container.querySelector(".showBlog");

  expect(div).toHaveTextContent("this is a test blog");
  expect(div).toHaveTextContent("Logn Xu");
  expect(div).toHaveTextContent("http://localhost/hahaha");
  expect(div).toHaveTextContent(89);
});

test("renders send likes", async () => {
  const blog = {
    title: "this is a test blog",
    author: "Logn Xu",
    url: "http://localhost/hahaha",
    likes: 89,
  };

  const mockHandle = vi.fn();

  render(<Blog blog={blog} handleLike={mockHandle} />);

  const user = userEvent.setup();
  const button = screen.getByText("like");
  await user.click(button);
  await user.click(button);

  expect(mockHandle.mock.calls).toHaveLength(2);
});


