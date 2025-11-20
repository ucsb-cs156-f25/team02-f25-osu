import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";
import DiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";

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
    useParams: vi.fn(() => ({
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("UCSBDiningCommonsMenuItemEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/ucsb-dining-commons-menu-items", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit UCSB Dining Commons Menu Item");
      expect(screen.queryByTestId("UCSBDiningCommonsMenuItem-name")).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/ucsb-dining-commons-menu-items", { params: { id: 17 } }).reply(200, {
        id: 17,
        name: "Buffalo Wings",
        diningCommonsCode: "Ortega",
        station: "Grill",
      });
      axiosMock.onPut("/api/ucsb-dining-commons-menu-items").reply(200, {
        id: "17",
        name: "Buffalo Wings Edited",
        diningCommonsCode: "Ortega Edited",
        station: "Grill Edited",
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");

      const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
      const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
      const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
      const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
      const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(nameField).toBeInTheDocument();
      expect(nameField).toHaveValue("Buffalo Wings");
      expect(diningCommonsCodeField).toBeInTheDocument();
      expect(diningCommonsCodeField).toHaveValue("Ortega");
      expect(stationField).toBeInTheDocument();
      expect(stationField).toHaveValue("Grill");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(nameField, {
        target: { value: "Buffalo Wings Edited" },
      });
      fireEvent.change(diningCommonsCodeField, {
        target: { value: "Ortega Edited" },
      });
      fireEvent.change(stationField, {
        target: { value: "Grill Edited" },
      });
      fireEvent.click(submitButton);


      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSB Dining Commons Menu Item Updated - id: 17 name: Buffalo Wings Edited",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/ucsb-dining-commons-menu-items" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          name: "Buffalo Wings Edited",
          station: "Grill Edited",
          diningCommonsCode: "Ortega Edited",
          
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");

      const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
      const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
      const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
      const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
      const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

      expect(idField).toHaveValue("17");
      expect(nameField).toHaveValue("Buffalo Wings");
      expect(diningCommonsCodeField).toHaveValue("Ortega");
      expect(stationField).toHaveValue("Grill");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(nameField, {
        target: { value: "Buffalo Wings Edited" },
      });
      fireEvent.change(diningCommonsCodeField, { target: { value: "Ortega Edited" } });
      fireEvent.change(stationField, { target: { value: "Grill Edited" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSB Dining Commons Menu Item Updated - id: 17 name: Buffalo Wings Edited",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/ucsb-dining-commons-menu-items" });
    });
  });
});
