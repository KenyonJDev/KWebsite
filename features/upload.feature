Feature: Uploading a song
    The user should be able to upload a song and its album art.
    The song should be uploadable into a playlist.

    Scenario: Uploading a song and image
        Given the browser is open on the home page
        When I navigate to the "register" page
        When I enter "testName4" in the "user" field
        When I enter "password" in the "pass" field
        When I click on the "register" button

        Then take a screenshot called "1"
        Then the title should be "Login"
        When I enter "testName4" in the "user" field 
        When I enter "password" in the "pass" field
        When I click on the "login" button

        Then the title should be "Sense"
        When I navigate to the "playlists" page
        Then take a screenshot called "before-playlist-create"
        When I enter "Test Playlist" in the "newName" field
        When I enter "This is a description" in the "newDesc" field
        When I click on the "create" button

        When I navigate to the "upload" page
        When I select an mp3 file called "sample"
        When I select a photo in the album art field
        When I select the "Test Playlist" playlist
        Then take a screenshot called "after-selections"
        When I click on the "upload" button
        Then take a screenshot called "after-upload"
        Then the title should be "test title"

    Scenario: deleting an uploaded song
        When I navigate to the "upload" page
        Then take a screenshot called "2"
        When I select an mp3 file called "sample"
        When I select a photo in the album art field
        When I select the "Test Playlist" playlist
        Then take a screenshot called "after-selections"
        When I click on the "upload" button
        When I click on the "delete" button
        Then the title should be "Sense"
        Then the message box should say "song deleted!"


