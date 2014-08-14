var SpotifyWebApi = require("spotify-web-api-node");
var config = require('./config');
var login = require('./login');

console.log('[Spotify] Configured with client ID ' + config.clientId);
var spotifyApi = new SpotifyWebApi({
  clientId : config.clientId,
  clientSecret : config.clientSecret,
  redirectUri : config.redirectUri
});

var addSongBatchQueue = [];
var addSongBatchInterval = 15000; //ms

function addToPlaylist(uri) {
    if (uri) {
        addSongBatchQueue.push(uri);
    }
}

function addSongBatch() {
    var songsInQueue = addSongBatchQueue.length;
    if (songsInQueue) {
        console.log('[Spotify] Batching ' + songsInQueue + ' songs');
        spotifyApi.addTracksToPlaylist(config.username, config.playlistId, addSongBatchQueue);
        addSongBatchQueue = [];
    }
}

setInterval(addSongBatch, addSongBatchInterval);


function search(artist, title, callback) {
    var query = artist + ' ' + title;
    console.log('[Spotify] searching for ' + query);
    spotifyApi.searchTracks(artist + ' ' + title)
    .then(function(data) {
        var firstPage = data.tracks.items;
        var firstItem = data.tracks.items[0];
        if (!firstItem) {
            console.log('[Spotify] Could not find track: ' + query);
            callback();
        }
        callback(firstItem.uri);
    }, function(err) {
        console.log('[Spotify] Error');
        console.log(err);
        callback(err);
    });
}


function authorize(callback) {
    login.loginAndGetAuthCode(function(authorizationCode) {
        spotifyApi.authorizationCodeGrant(authorizationCode)
            .then(function(data) {
                spotifyApi.setAccessToken(data['access_token']);
                spotifyApi.setRefreshToken(data['refresh_token']);

                callback();
            }, function(err) {
                console.log('Something went wrong when retrieving the access token!', err);
            });
    });
}

exports.searchAndAdd = function(tracks) {
    authorize(function() {
        tracks.forEach(function(track) {
            search(track.artist, track.title, function(uri) {
                addToPlaylist(uri);
            });
        });
    });
}
