describe("test cypress instance", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win: Cypress.AUTWindow) {
        win.localStorage.setItem("token", "test-token");
      },
    });
  });

  it("will test cypress", () => {
    cy.get("img").should("be.visible");
  });
});

export {};
