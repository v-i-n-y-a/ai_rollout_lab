import React from "react";
import { RolloutSlider } from "../../src/components/RolloutSlider";

describe("RolloutSlider", () => {
  it("renders label, range input, value and update button", () => {
    const onChange = cy.stub().as("onChange");
    const onUpdate = cy.stub().as("onUpdate");
    cy.mount(
      <RolloutSlider
        label="ai_summary"
        value={50}
        onChange={onChange}
        onUpdate={onUpdate}
      />
    );
    cy.get("[data-cy=rollout-slider]").should("be.visible");
    cy.get("[data-cy=rollout-label]").should("contain.text", "ai_summary");
    cy.get("[data-cy=rollout-slider-input]").should("have.value", "50");
    cy.get("[data-cy=rollout-value]").should("contain.text", "50%");
    cy.get("[data-cy=rollout-update-btn]").should("be.visible").and("contain.text", "Update");
  });

  it("calls onChange when slider moves", () => {
    const onChange = cy.stub().as("onChange");
    cy.mount(
      <RolloutSlider label="flag" value={25} onChange={onChange} />
    );
    cy.get("[data-cy=rollout-slider-input]")
      .invoke("val", 75)
      .trigger("change", { target: { value: "75" } as unknown as EventTarget });
    cy.get("@onChange").should("have.been.calledWith", 75);
  });

  it("calls onUpdate when Update is clicked", () => {
    const onUpdate = cy.stub().as("onUpdate");
    cy.mount(
      <RolloutSlider label="ai_summary" value={80} onChange={() => {}} onUpdate={onUpdate} />
    );
    cy.get("[data-cy=rollout-update-btn]").click();
    cy.get("@onUpdate").should("have.been.calledOnce");
  });

  it("disables update button when updating", () => {
    cy.mount(
      <RolloutSlider
        label="ai_summary"
        value={50}
        onChange={() => {}}
        onUpdate={() => {}}
        updating
      />
    );
    cy.get("[data-cy=rollout-update-btn]").should("be.disabled");
    cy.get("[data-cy=rollout-update-btn]").should("contain.text", "Updating");
  });
});
