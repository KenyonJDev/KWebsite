Feature: Registering an account
    The user should be able to register an account.

    Scenario: registering a new user
        Given the browser is open on the home page
        When I navigate to the "register" page
        Then take a screenshot called "before-new-register"
        When I enter "testName" in the "user" field
        When I enter "password" in the "pass" field
        When I click on the "register" button
        Then take a screenshot called "after-new-register"
        Then the title should be "Log In"

    Scenario: trying to register an existing user
        Given the browser is open on the home page
        When I navigate to the "register" page
        Then take a screenshot called "before-exist-register"
        When I enter "testName" in the "user" field
        When I enter "password" in the "pass" field
        When I click on the "register" button
        Then take a screenshot called "after-exist-register"
        Then the title should be "Create an Account"
        Then the message box should say 'username "testName" already in use'
