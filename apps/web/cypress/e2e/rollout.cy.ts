describe("Rollout behavior", () => {
  beforeEach(() => {
    cy.clearAllSessionStorage();
  });

  it("shows AI summary when in rollout", () => {
    cy.intercept("GET", "**/items?*", {
      statusCode: 200,
      body: {
        items: [
          { id: "1", title: "Item 1", description: "Desc 1", createdAt: "2025-01-01T00:00:00Z" },
          { id: "2", title: "Item 2", description: "Desc 2", createdAt: "2025-01-01T00:00:00Z" },
        ],
      },
    });
    cy.intercept("GET", "**/items/1/summary*", {
      statusCode: 200,
      body: {
        summary: { itemId: "1", summary: "E2E summary text.", generatedAt: "2025-01-01T00:00:00Z" },
        inRollout: true,
      },
    }).as("getSummary");
    cy.intercept("GET", "**/items/1", {
      statusCode: 200,
      body: { id: "1", title: "Item 1", description: "Desc 1", createdAt: "2025-01-01T00:00:00Z" },
    });
    cy.intercept("POST", "**/events", { statusCode: 201, body: { id: "e1" } }).as("logEvent");

    cy.visit("/");
    cy.contains("Item 1").click();
    cy.url().should("include", "/item/1");
    cy.wait("@getSummary");

    cy.get("[data-cy=ai-summary-card]").should("be.visible");
    cy.get("[data-cy=ai-summary-text]").should("contain.text", "E2E summary text.");
  });

  it("shows rollout message when not in rollout", () => {
    cy.intercept("GET", "**/items?*", {
      statusCode: 200,
      body: {
        items: [
          { id: "1", title: "Item 1", description: "Desc 1", createdAt: "2025-01-01T00:00:00Z" },
          { id: "2", title: "Item 2", description: "Desc 2", createdAt: "2025-01-01T00:00:00Z" },
        ],
      },
    });
    cy.intercept("GET", "**/items/2/summary*", {
      statusCode: 200,
      body: { summary: null, inRollout: false },
    }).as("getSummary");
    cy.intercept("GET", "**/items/2", {
      statusCode: 200,
      body: { id: "2", title: "Item 2", description: "Desc 2", createdAt: "2025-01-01T00:00:00Z" },
    });

    cy.visit("/");
    cy.contains("Item 2").click();
    cy.url().should("include", "/item/2");
    cy.wait("@getSummary");

    cy.contains("not available for your session").should("be.visible");
    cy.get("[data-cy=ai-summary-card]").should("not.exist");
  });

  it("shows feedback form when summary is present", () => {
    cy.intercept("GET", "**/items/1/summary*", {
      statusCode: 200,
      body: {
        summary: { itemId: "1", summary: "Summary.", generatedAt: "2025-01-01T00:00:00Z" },
        inRollout: true,
      },
    });
    cy.intercept("GET", "**/items/1", {
      statusCode: 200,
      body: { id: "1", title: "Item 1", description: "Desc", createdAt: "2025-01-01T00:00:00Z" },
    });
    cy.intercept("POST", "**/events", { statusCode: 201, body: { id: "e1" } });
    cy.intercept("POST", "**/feedback", { statusCode: 201, body: { id: "f1" } }).as("submitFeedback");

    cy.visit("/item/1");
    cy.get("[data-cy=feedback-form]").should("be.visible");
    cy.get("[data-cy=feedback-rating]").select("5");
    cy.get("[data-cy=feedback-submit]").click();
    cy.wait("@submitFeedback");
    cy.get("[data-cy=feedback-thanks]").should("be.visible");
  });
});
