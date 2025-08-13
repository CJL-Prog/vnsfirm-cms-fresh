// cypress/integration/login.spec.js
describe('Login Flow', () => {
  it('should log in successfully with valid credentials', () => {
    cy.visit('/');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.contains('Sign In').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });
  
  it('should show error with invalid credentials', () => {
    cy.visit('/');
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.contains('Sign In').click();
    cy.contains('Invalid email or password').should('be.visible');
  });
});