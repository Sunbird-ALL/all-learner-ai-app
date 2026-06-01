import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MilestoneFormDialog from "../MilestoneFormDialog";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("MilestoneFormDialog", () => {
  it("renders without crashing when closed", () => {
    renderWithRouter(<MilestoneFormDialog open={false} onClose={jest.fn()} />);
  });

  it("renders without crashing when open", () => {
    renderWithRouter(
      <MilestoneFormDialog
        open={true}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
  });
});
