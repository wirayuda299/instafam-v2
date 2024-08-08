import SearchForm from "@/components/shared/sidebar/search-form";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

describe("search form", () => {
  it("should be hidden if  path is not messages", () => {
    render(<SearchForm isCurrentPathMessages={true} />);

    expect(screen.queryByText("Search")).toBeNull();
  });

  it("should be not hidden if  path is  messages", () => {
    render(<SearchForm isCurrentPathMessages={false} />);

    expect(screen.queryByText("Search")).not.toBeNull();
  });
});
