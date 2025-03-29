import Header from "./index";
import { render, screen, fireEvent, act } from "../../../tests/test-utils";

describe("Header Component", () => {
  const props = {
    collapsed: false,
    setCollapsed: jest.fn(),
    drawerVisible: false,
    setDrawerVisible: jest.fn(),
    isMobile: false,
    dispatch: jest.fn(),
    authentication: {},
  };

  beforeEach(() => {
    render(<Header {...props} />);
  });

  test("should render search in placeholder", () => {
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });
  test("renders messages button", () => {
    const messagesButton = screen.getByRole("button", { name: /messages/i });
    expect(messagesButton).toBeInTheDocument();
  });
  test("renders user profile image", () => {
    const userProfileImage = screen.getByAltText(/user profile photo/i);
    expect(userProfileImage).toBeInTheDocument();
  });
  test("renders dropdown menu when user profile image is clicked", async () => {
    const userProfileImage = screen.getByAltText(/user profile photo/i);
    await act(async () => {
      fireEvent.click(userProfileImage);
    });

    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
    expect(screen.getByText(/help center/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
});
