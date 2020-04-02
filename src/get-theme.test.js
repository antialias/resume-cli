import getTheme from "./get-theme";

jest.mock("./utils/require-resolve", () => () => (request) => {
  if (request === "jsonresume-theme-bar") {
    return "../test/theme-bar.js";
  }
  if (request === "jsonresume-theme-foo") {
    return "../test/theme-foo.js";
  }
  const error = new Error();
  error.code = "MODULE_NOT_FOUND";
  throw error;
});
jest.mock("./build-theme-proxy", () => {
  const mySpy = jest.fn();
  mySpy.mockReturnValue(mySpy);
  return mySpy;
});

describe("get-theme", () => {
  it("should prefix theme names if they do not already have the prefix", () => {
    const theme = getTheme({ name: "foo" });
    expect(theme.render({})).toMatchInlineSnapshot(`"test-theme-foo"`);
  });
  it("should not prefix theme names if they already have the prefix", () => {
    const theme = getTheme({ name: "jsonresume-theme-foo" });
    expect(theme.render({})).toMatchInlineSnapshot(`"test-theme-foo"`);
  });
  it("should not fall back to remote if remoteFallback is false", () => {
    expect(() =>
      getTheme({ name: "jsonresume-theme-not-a-valid-theme" })
    ).toThrowErrorMatchingInlineSnapshot(
      `"theme jsonresume-theme-not-a-valid-theme could not be imported locally. Use --remote-fallback to attempt to render the resume by POSTing it to https://themes.jsonresume.org/theme/jsonresume-theme-not-a-valid-theme"`
    );
  });
  it("should fall back to default remote if remoteFallback is true", () => {
    expect(
      getTheme({ remoteFallback: true, name: "not-a-valid-theme" })
    ).toHaveBeenCalledWith({
      server: "https://themes.jsonresume.org/theme/",
      name: "not-a-valid-theme",
    });
  });
  it("should fall back to remote if remoteFallback is set", () => {
    expect(
      getTheme({ remoteFallback: "my-fallback", name: "not-a-valid-theme" })
    ).toHaveBeenCalledWith({
      server: "my-fallback",
      name: "not-a-valid-theme",
    });
  });
});
