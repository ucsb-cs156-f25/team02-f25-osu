import { onDeleteSuccess } from "main/utils/UCSBDiningCommonsMenuItemUtils";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

describe("UCSBDiningCommonsMenuItemUtils onDeleteSuccess", () => {
  test("calls toast with the message", () => {
    const message = "Menu item deleted";

    onDeleteSuccess(message);

    expect(toast).toHaveBeenCalledWith(message);
  });
});