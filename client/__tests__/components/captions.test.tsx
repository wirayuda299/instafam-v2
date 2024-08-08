import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

import Captions from "@/components/shared/post-card/captions";

describe("captions", () => {
  const limit = 80;

  it("should render the more button when captions length is >= 100", () => {
    const longCaption = "a".repeat(limit);

    render(<Captions captions={longCaption} />);

    const moreBtn = screen.queryByRole("button", { name: "more" });

    expect(moreBtn).toBeInTheDocument();
    expect(moreBtn).toHaveTextContent(/more/i);
  });

  it("should not render the more button when captions length is < 100", () => {
    const shortCaption = "a".repeat(limit - 1);

    render(<Captions captions={shortCaption} />);
    const moreBtn = screen.queryByRole("button", { name: "more" });

    expect(screen.getByText(shortCaption)).toBeInTheDocument();
    expect(moreBtn).toBeNull();
  });

  it("should expand caption when button clicked", () => {
    const longCapts = "a".repeat(limit + 1);
    render(<Captions captions={longCapts} />);

    const truncatedText = longCapts.substring(0, limit) + "...";
    const moreBtn = screen.getByRole("button", { name: "more" });

    expect(moreBtn).toBeInTheDocument();
    expect(moreBtn).toHaveTextContent("more");
    expect(screen.getByText(truncatedText)).toBeInTheDocument();

    fireEvent.click(moreBtn);
    expect(moreBtn).toHaveTextContent("hide");
    expect(screen.getByTestId("captions")).toHaveTextContent(longCapts);
  });
});
