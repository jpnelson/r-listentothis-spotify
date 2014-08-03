# r/listentothis Spotify playlist

This tool is used to periodically update the [r/listentothis](http://www.reddit.com/r/listentothis) playlist.

## Configuring the project

### On your Spotify developer's account
* Get [a developer Spotify account](https://developer.spotify.com/my-applications/#!/applications), and create a new app.
* Save the **Client ID** and **Client Secret** to a file in `src` called `config.json` (follow the example of `config.example.json`)
* Set the redirect URI to https://www.runscope.com/oauth_tool/callback

### On Runscope
* Go to the [OAuth2 generation tool](https://www.runscope.com/oauth2_tool) on
Runscope, and enter
    * Client ID, as in your `config.json`
    * Client Secret, as in your `config.json`
    * Authorize URL: `https://accounts.spotify.com/authorize`
    * Access token URL `https://accounts.spotify.com/api/token`
    * Scopes: `playlist-modify-private`
* Generate a token, and copy from the response:
    * `access_token`
    * `refresh_token`
* Add these to your `config.json` as well.

The server will start using these tokens, and then refresh them once every half
hour (the expiration is one hour, so you may need to re-generate a token if you leave it too long)

## Running the project

To run:
* `npm install` in the base directory
* `node listentothis.js` in the `src/` directory
    * use `node listentothis.js -w X` to run the server, with the first add happening in `X` minutes
