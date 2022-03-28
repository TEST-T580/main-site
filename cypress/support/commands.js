import "cypress-localstorage-commands";

Cypress.Commands.add("login", (overrides = {}) => {
  Cypress.log({
    name: "loginAuth0",
  });

  const options = {
    method: "POST",
    url: Cypress.env("auth_url"),
    failOnStatusCode: false,
    body: {
      grant_type: Cypress.env("grant_type"),
      username: Cypress.env("auth_username"),
      password: Cypress.env("auth_password"),
      audience: Cypress.env("auth_audience"),
      scope: Cypress.env("auth_scope"),
      client_id: Cypress.env("auth_client_id"),
      client_secret: Cypress.env("auth_client_secret"),
      realm: Cypress.env("realm"),
    },
  };

  cy.request(options)
    .then((resp) => {
      return resp.body;
    })
    .then((body) => {
      cy.visit(Cypress.env("auth_url"));
      const { access_token } = body;
      cy.setLocalStorage("<token>", JSON.stringify(access_token));

      if (cy.contains('[href="/profile"]', "Min side").should("exist")) {
        cy.get('a[href="/profile"]').click();
        cy.get("body").then(($body) => {
          if ($body.find('h1[class="c0e35cb40 c79dbc5fc"]').length > 0) {
            cy.get("#username").type(Cypress.env("auth_username"));
            cy.get("#password").type(Cypress.env("auth_password"));
            cy.get('button[type="submit"]').click();
          }
        });
        cy.get('h1[class="Donations_header__oe9QR"]').contains("Donasjoner");
      }
    });
});