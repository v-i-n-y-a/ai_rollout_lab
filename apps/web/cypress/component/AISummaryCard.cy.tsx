import React from "react";
import { AISummaryCard } from "../../src/components/AISummaryCard";

describe("AISummaryCard", () => {
  it("renders summary text and badge", () => {
    cy.mount(
      <AISummaryCard summary="This is the AI-generated summary." />
    );
    cy.get("[data-cy=ai-summary-card]").should("be.visible");
    cy.get("[data-cy=ai-summary-badge]").should("contain.text", "AI summary");
    cy.get("[data-cy=ai-summary-text]").should("contain.text", "This is the AI-generated summary.");
  });

  it("renders custom badge", () => {
    cy.mount(
      <AISummaryCard summary="Summary." badge="Summary" />
    );
    cy.get("[data-cy=ai-summary-badge]").should("contain.text", "Summary");
  });

  it("renders children", () => {
    cy.mount(
      <AISummaryCard summary="Summary.">
        <button type="button">Submit feedback</button>
      </AISummaryCard>
    );
    cy.get("[data-cy=ai-summary-card]").find("button").should("contain.text", "Submit feedback");
  });
});
