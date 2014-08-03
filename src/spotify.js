var SpotifyWebApi = require("spotify-web-api-node");
var config = require('./config');

console.log('Configured with client ID ' + config.clientId);

var spotifyApi = new SpotifyWebApi({
  clientId : config.clientId,
  clientSecret : config.clientSecret,
  redirectUri : config.redirectUri
});

function addToPlaylist(uri) {
    return spotifyApi.addTracksToPlaylist(config.username, config.playlistId, [uri]);
}

function search(artist, track, callback) {
    spotifyApi.searchTracks(artist + ' ' + track)
    .then(function(data) {
        var firstPage = data.tracks.items;
        var firstItem = data.tracks.items[0];
        if (!firstItem) {
            console.log('Could not find track');
            callback();
        }
        callback(firstItem.uri);
    }, function(err) {
        console.log('Error: ' + err);
        callback(err);
    });
}

function refreshAccessToken() {
    spotifyApi.refreshAccessToken()
        .then(function(data) {
                tokenExpirationEpoch = (new Date().getTime() / 1000) + data['expires_in'];
                console.log('Refreshed token. It now expires in ' + Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) + ' seconds');
            }, function(err) {
                console.log('Could not refresh the token!', err);
            });
}

setInterval(refreshAccessToken, 1800 * 1000);


function initialiseAccessToken() {
    spotifyApi.setAccessToken(config.accessToken);
    spotifyApi.setRefreshToken(config.refreshToken);
}

initialiseAccessToken();

exports.searchAndAdd = function(artist, track) {
    search(artist, track, function(uri) {
        addToPlaylist(uri);
    });
}
