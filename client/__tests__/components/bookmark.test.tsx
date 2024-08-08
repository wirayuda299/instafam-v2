import Bookmarks from "@/components/shared/post-card/bookmarks";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ClerkProvider } from "@clerk/nextjs";

vi.mock("@/lib/uploadthing", () => ({
  utapi: vi.fn().mockImplementation(() => Promise.resolve()),
}));

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
    })),
    useSearchParams: vi.fn(() => ({
      // get: vi.fn(),
    })),
    usePathname: vi.fn(),
  };
});

describe("bookmark component", () => {
  it("should render nothing if no postId provided", () => {
    render(
      <ClerkProvider
        publishableKey={
          "pk_test_bGFzdGluZy1tYW1tYWwtNjYuY2xlcmsuYWNjb3VudHMuZGV2JA"
        }
      >
        <Bookmarks postId={null} />
      </ClerkProvider>,
    );

    expect(screen.queryByTestId("bookmark")).toBeNull();
  });
});
