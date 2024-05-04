import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import { vi } from "vitest";

test("renders add new blog", async () => {
  const mockHandle = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm handleNewBlog={mockHandle} />);

  const titleInput = screen.getByRole("textbox", { name: /title/ });
  const urlInput = screen.getByRole("textbox", { name: /url/ });
  const authorInput = screen.getByRole("textbox", { name: /author/ });
  //   const sendButton = screen.getByText("create");

  await user.type(titleInput, "this is a test blog");
  await user.type(authorInput, "Logn Xu");
  await user.type(urlInput, "http://localhost/hahaha");
  //   await user.click(sendButton);
  // const div = container.querySelector(".blogForn");
  // screen.debug(div);

  // expect(div).toHaveTextContent("this is a test blog");
  //   expect(div).toHaveTextContent("Logn Xu");
  //   expect(div).toHaveTextContent("http://localhost/hahaha");
  //   expect(div).toHaveTextContent(89);
});
