Feature: Logging into an account
    The user should should be able to log in after making an account.

    Scenario: registering a new user
        Given the browser is open on the home page
        When I navigate to the "register" page
        Then take a screenshot called "before-new-register"
        When I enter "testName" in the "user" field
        When I enter "password" in the "pass" field
        When I click on the "register" button
        Then take a screenshot called "after-new-register"
        Then the title should be "Login"

    Scenario: registering as an existing username
        When I navigate to the "register" page
        Then take a screenshot called "before-exist-register"
        When I enter "testName" in the "user" field
        When I enter "password" in the "pass" field
        When I click on the "register" button
        Then take a screenshot called "after-exist-register"
        Then the title should be "Register"
        Then the message box should say 'username "testName" already in use'

    Scenario: logging into existing account
        When I navigate to the "login" page
        Then take a screenshot called "before-exit-login"
        When I enter "testName" in the "user" field
        When I enter "password" in the "pass" field
        When I click on the "login" button
        Then take a screenshot called "after-exist-login"
        Then the title should be "Sense"
        Then the message box should say "you are now logged in..."

    Scenario: Logging out
        When I navigate to the "logout" page
        Then take a screenshot called "after-logout"
        Then the message box should say "you are now logged out"

    Scenario: logging into nonexistent account
        When I navigate to the "logout" page
        When I navigate to the "login" page
        Then I enter "notTestName" in the "user" field
        Then I enter "pass" in the "pass" field
        When I click on the "login" button
        Then take a screenshot called "after-nonexist-login"
