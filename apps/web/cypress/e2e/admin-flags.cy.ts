describe("Admin flag updates", () => {
  it("loads flags and metrics", () => {
    cy.intercept("GET", "**/admin/flags", {
      statusCode: 200,
      body: {
        flags: [
          { key: "ai_summary", rolloutPercent: 50, updatedAt: "2025-01-01T00:00:00Z" },
        ],
      },
    }).as("getFlags");
    cy.intercept("GET", "**/metrics", {
      statusCode: 200,
      body: { byKind: { view: 10, feedback: 2 }, total: 12 },
    }).as("getMetrics");

    cy.visit("/admin");
    cy.wait("@getFlags");
    cy.wait("@getMetrics");

    cy.get("[data-cy=rollout-slider]").should("be.visible");
    cy.get("[data-cy=rollout-label]").should("contain.text", "ai_summary");
    cy.get("[data-cy=rollout-value]").should("contain.text", "50%");
    cy.contains("view").should("be.visible");
    cy.contains("Total: 12").should("be.visible");
  });

  it("updates flag when slider and Update are used", () => {
    cy.intercept("GET", "**/admin/flags", {
      statusCode: 200,
      body: {
        flags: [
          { key: "ai_summary", rolloutPercent: 50, updatedAt: "2025-01-01T00:00:00Z" },
        ],
      },
    });
    cy.intercept("GET", "**/metrics", { statusCode: 200, body: { byKind: {}, total: 0 } });
    cy.intercept("PATCH", "**/admin/flags", {
      statusCode: 200,
      body: { key: "ai_summary", rolloutPercent: 75, updatedAt: "2025-01-02T00:00:00Z" },
    }).as("updateFlag");

    cy.visit("/admin");
    cy.get("[data-cy=rollout-slider-input]").invoke("val", 75).trigger("input");
    cy.get("[data-cy=rollout-update-btn]").click();
    cy.wait("@updateFlag").its("request.body").should("deep.equal", {
      key: "ai_summary",
      rolloutPercent: 75,
    });
    cy.get("[data-cy=rollout-value]").should("contain.text", "75%");
  });
});
