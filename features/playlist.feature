Feature: Creating playlists
    The user should be able to log in and create a playlist.

    Scenario: registering and creating a playlist
        Given the browser is open on the home page
        When I navigate to the "register" page
        When I enter "testName2" in the "user" field
        When I enter "password" in the "pass" field
        When I click on the "register" button

        Then the title should be "Log In"
        When I enter "testName2" in the "user" field
        When I enter "password" in the "pass" field
        When I click on the "login" button

        Then the title should be "Sense"
        When I navigate to the "playlists" page
        Then take a screenshot called "before-playlist-create"
        When I enter "Test Playlist" in the "newName" field
        When I enter "This is a description" in the "newDesc" field
        When I click on the "create" button
        Then take a screenshot called "after-playlist-create"
        Then the title should be "Create Playlist | Sense"
        Then the message box should say 'new playlist "Test Playlist" created'

    Scenario: adding a song to a playlist
        When I navigate to the "upload" page
        When I select an mp3 file called "sample"
        When I select a photo in the album art field
        When I select the "Test Playlist" playlist
        When I click on the "upload" button

        When I navigate to the "playlists" page
        When I enter "Test 2" in the "newName" field
        When I enter "sdfsdfsdf" in the "newDesc" field
        When I click on the "create" button
        Then the message box should say 'new playlist "Test 2" created'

        When I select the "Test 2" playlist
        When I select the "test title" song
        When I click on the "link" button
        Then take a screenshot called "after-link"
        Then the message box should say "Song added!"
        Then the songs table should contain "1" rows
