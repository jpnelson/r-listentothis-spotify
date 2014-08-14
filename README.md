# r/listentothis Spotify playlist

This tool is used to periodically update the [r/listentothis](http://www.reddit.com/r/listentothis) playlist.

## Configuring the project

### On your Spotify developer's account
* Get [a developer Spotify account](https://developer.spotify.com/my-applications/#!/applications), and create a new app.
* Save the **Client ID** and **Client Secret** to a file in `src` called `config.json` (follow the example of `config.example.json`)
* Save your spotify username and password to the same file.
* Set the redirect URI to any URL you have control over. PhantomJS is used to log in through spotify, so hopefully something with SSL.

## Running the project

To run:
* `npm install` in the base directory
* `node listentothis.js` in the `src/` directory
    * use `node listentothis.js -w X` to run the server, with the first add happening in `X` minutes
