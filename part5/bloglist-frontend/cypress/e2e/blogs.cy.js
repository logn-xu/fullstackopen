describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    const user1 = {
      name: "Logn",
      username: "root",
      password: "logn",
    };

    cy.request("POST", "http://localhost:3003/api/user/", user1);

    const user2 = {
      name: "Lecen",
      username: "admin",
      password: "cowcow",
    };
    cy.request("POST", "http://localhost:3003/api/user/", user2);
    cy.visit("http://localhost:5173/");
  });

  it("Login form is shown", function () {
    cy.contains("login").click();
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("root");
      cy.get("#password").type("logn");
      cy.get("#login-button").click();
      cy.contains("Login secuess");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("root");
      cy.get("#password").type("root");
      cy.get("#login-button").click();
      cy.contains("Request failed with status code 400");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "root", password: "logn" });
    });

    it("A blog can be created", function () {
      cy.contains("new note").click();
      cy.get("#title").type("title");
      cy.get("#author").type("author");
      cy.get("#url").type("url");
      cy.get("#blog-button").click();
      cy.contains("title author");
    });
  });

  describe("likes blogs", function () {
    beforeEach(function () {
      cy.login({ username: "root", password: "logn" });

      cy.contains("new note").click();
      cy.get("#title").type("title");
      cy.get("#author").type("author");
      cy.get("#url").type("url");
      cy.get("#blog-button").click();
    });

    it("A blog with be like", function () {
      cy.get(".hideBlog > button").click();
      cy.get(":nth-child(3) > button").click();
      cy.get(".showBlog > :nth-child(3)").contains("1");
    });
  });

  describe("Delete a blogs by author", function () {
    describe("delete by author", function () {
      beforeEach(function () {
        cy.login({ username: "root", password: "logn" });

        cy.contains("new note").click();
        cy.get("#title").type("title");
        cy.get("#author").type("author");
        cy.get("#url").type("url");
        cy.get("#blog-button").click();
      });

      it("A blog with be delete", function () {
        cy.get(".hideBlog > button").click();
        cy.get(":nth-child(3) > button").click();
        cy.get(".showBlog > div > button").click();
        cy.contains("title author").should("not.exist");
      });
    });

    describe("delete not by author", function () {
      beforeEach(function () {
        cy.login({ username: "admin", password: "cowcow" });

        cy.contains("new note").click();
        cy.get("#title").type("title");
        cy.get("#author").type("author");
        cy.get("#url").type("url");
        cy.get("#blog-button").click();

        cy.contains("logout").click();
      });

      it.only("A blog with be delete but not author", function () {
        cy.login({ username: "root", password: "logn" });

        cy.get(".hideBlog > button").click();
        console.log(cy.get(".hideBlog").id);
        cy.get(".showBlog > div > button", { failOnStatusCode: false });
        // .click()

        // cy.wait("@remove-faild").should(
        //   "have.property",
        //   "response.statusCode",
        //   403
        // );
      });
    });
  });
});
