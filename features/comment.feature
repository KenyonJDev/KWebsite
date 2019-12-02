Feature: Posting a comment
    The comment should be posted after running Scenario Outline: Post a comment

    Scenario: Post a comment
        Given the browser is open on the home page
        When I navigate to the "register" page
        When I enter "testName3" in the "user" field
        When I enter "password" in the "pass" field
        When I click on the "register" button

        When I enter "testName3" in the "user" field 
        When I enter "password" in the "pass" field
        When I click on the "login" button

        When I navigate to the "playlists" page
        When I enter "Test Playlist" in the "newName" field
        When I enter "This is a description" in the "newDesc" field
        When I click on the "create" button

        When I navigate to the "upload" page
        When I select an mp3 file called "sample"
        When I select a photo in the album art field
        When I select the "Test Playlist" playlist
        When I click on the "upload" button


        When I select the "Test Playlist" playlist
        Then take a screenshot called "before-exist-comment"
        When I enter "test" in the "-comment" field
        When I click on the "-submit" button
        Then take a screenshot called "after-exist-comment"
        Then the message box should say "test"