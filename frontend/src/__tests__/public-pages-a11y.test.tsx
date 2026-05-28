import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { ResourcesPage } from "../pages/ResourcesPage";
import { NewsPage } from "../pages/NewsPage";
import { ContactPage } from "../pages/ContactPage";
import { AccessibilityPage } from "../pages/AccessibilityPage";

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Public Pages Accessibility", () => {
  test("HomePage should have no accessibility violations", async () => {
    const { container } = renderWithProviders(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("AboutPage should have no accessibility violations", async () => {
    const { container } = renderWithProviders(<AboutPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ResourcesPage should have no accessibility violations", async () => {
    const { container } = renderWithProviders(<ResourcesPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("NewsPage should have no accessibility violations", async () => {
    const { container } = renderWithProviders(<NewsPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ContactPage should have no accessibility violations", async () => {
    const { container } = renderWithProviders(<ContactPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("AccessibilityPage should have no accessibility violations", async () => {
    const { container } = renderWithProviders(<AccessibilityPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
