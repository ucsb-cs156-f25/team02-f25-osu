import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { expect } from "vitest";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("UCSBDiningCommonsMenuItemCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
describe("UCSBDiningCommonsMenuItemCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemCreatePage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
  
      await waitFor(() => {
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Dining Common Code")).toBeInTheDocument();
        expect(screen.getByLabelText("Station")).toBeInTheDocument();
      });
  });

  test("on submit, makes request to backend, and redirects to /ucsb-dining-commons-menu-items", async () => {
      const queryClient = new QueryClient();
      const ucsbDiningCommonsMenuItem = {
        id: 4,
        name: "Buffalo Wings",
        diningCommonsCode: "ortega",
        station: "Grill",
      };
  
      axiosMock.onPost("/api/ucsb-dining-commons-menu-items/post").reply(202, ucsbDiningCommonsMenuItem);
  
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemCreatePage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
  
      await waitFor(() => {
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Dining Common Code")).toBeInTheDocument();
        expect(screen.getByLabelText("Station")).toBeInTheDocument();
      });
  
      const nameInput = screen.getByLabelText("Name");
      expect(nameInput).toBeInTheDocument();
  
      const diningCommonsCodeInput = screen.getByLabelText("Dining Common Code");
      expect(diningCommonsCodeInput).toBeInTheDocument();

      const stationInput = screen.getByLabelText("Station");
      expect(stationInput).toBeInTheDocument();
  
      const createButton = screen.getByText("Create");
      expect(createButton).toBeInTheDocument();
  
      fireEvent.change(nameInput, { 
        target: { value: "Buffalo Wings" } 
      });
      fireEvent.change(diningCommonsCodeInput, {
        target: { value: "ortega" },
      });
      fireEvent.change(stationInput, {
        target: { value: "Grill" },
      });
      fireEvent.click(createButton);
  
      await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
  
      expect(axiosMock.history.post[0].params).toEqual({
        name: "Buffalo Wings",
        diningCommonsCode: "ortega",
        station: "Grill",
      });
  
      // assert - check that the toast was called with the expected message
      expect(mockToast).toBeCalledWith(
        "New menu item Created - id: 4 name: Buffalo Wings",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/ucsb-dining-commons-menu-items" });
    });
  };

  const queryClient = new QueryClient();
  test("Renders expected content", async () => {
    // arrange

    setupUserOnly();

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert

    await screen.findByText("Create page not yet implemented");
    expect(
      screen.getByText("Create page not yet implemented"),
    ).toBeInTheDocument();
  });
});
