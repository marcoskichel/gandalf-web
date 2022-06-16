import { render } from "@testing-library/react";

const Component = () => {
  return <div>gest</div>;
};

describe("Test", () => {
  it("test", () => {
    render(<Component />);
    expect(true).toBe(true);
  });
});
