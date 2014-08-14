var SpotifyWebApi = require("spotify-web-api-node");
var config = require('./config');

console.log('[Spotify] Configured with client ID ' + config.clientId);
function(){
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

    function refreshAccessToken(callback) {
        spotifyApi.refreshAccessToken()
            .then(function(data) {
                    tokenExpirationEpoch = (new Date().getTime() / 1000) + data['expires_in'];
                    console.log('[Spotify] Refreshed token. It now expires in ' + Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) + ' seconds');
                    console.log(data);
                    callback();
                }, function(err) {
                    console.log('[Spotify] Could not refresh the token!', err);
                });
    }


    function initialiseAccessToken() {
        spotifyApi.setAccessToken(config.accessToken);
        spotifyApi.setRefreshToken(config.refreshToken);
    }

    initialiseAccessToken();

    exports.searchAndAdd = function(tracks) {
        refreshAccessToken(function() {
            tracks.forEach(function(track) {
                search(track.artist, track.title, function(uri) {
                    addToPlaylist(uri);
                });
            });
        });
    }
}();
