import { it, expect, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CreatePostForm from "../../components/shared/sidebar/create-post-form";
import "@testing-library/jest-dom/vitest";

vi.mock("@/lib/uploadthing", () => ({
  utapi: vi.fn().mockImplementation(() => Promise.resolve()),
}));

describe("Create Post Form", () => {
  it("should have class hidden if path is start with messages", () => {
    render(
      <CreatePostForm
        Icon={<div></div>}
        label="test"
        isCurrentPathMessages={false}
      />,
    );
    expect(screen.getByTestId("cpf-label")).toHaveTextContent(/test/i);
  });

  it("should not have class hidden if path is not start with messages", () => {
    render(
      <CreatePostForm
        Icon={<div></div>}
        label="test"
        isCurrentPathMessages={true}
      />,
    );
    expect(screen.getByTestId("cpf-label")).toHaveTextContent(/test/i);
    expect(screen.getByTestId("cpf-label")).toHaveClass("hidden");
  });
});
