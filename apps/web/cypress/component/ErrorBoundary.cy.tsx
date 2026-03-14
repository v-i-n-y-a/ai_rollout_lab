import React from "react";
import { ErrorBoundary } from "../../src/components/ErrorBoundary";

const Thrower: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) throw new Error("Test error");
  return <span>OK</span>;
};

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    cy.mount(
      <ErrorBoundary>
        <Thrower shouldThrow={false} />
      </ErrorBoundary>
    );
    cy.contains("OK").should("be.visible");
  });

  it("renders fallback when child throws", () => {
    cy.mount(
      <ErrorBoundary>
        <Thrower shouldThrow={true} />
      </ErrorBoundary>
    );
    cy.get("[role=alert]").should("be.visible");
    cy.contains("Something went wrong").should("be.visible");
    cy.contains("Test error").should("be.visible");
    cy.contains("Retry").should("be.visible");
  });

  it("renders custom fallback when provided", () => {
    cy.mount(
      <ErrorBoundary fallback={<div data-cy="custom-fallback">Custom fallback</div>}>
        <Thrower shouldThrow={true} />
      </ErrorBoundary>
    );
    cy.get("[data-cy=custom-fallback]").should("contain.text", "Custom fallback");
    cy.get("[role=alert]").should("not.exist");
  });

  it("Retry button is clickable", () => {
    cy.mount(
      <ErrorBoundary>
        <Thrower shouldThrow={true} />
      </ErrorBoundary>
    );
    cy.get("[role=alert]").should("be.visible");
    cy.contains("Retry").should("be.visible").click();
  });
});
