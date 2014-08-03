var spotify = require('./spotify');
var reddit = require('./reddit');


function addRedditFrontPageToPlaylist() {
    reddit.getFrontPage(function(song) {
        spotify.searchAndAdd(song.artist, song.title);
        console.log('Attempting to add ' + song.artist + ' - ' + song.title)
    });
}

setInterval(addRedditFrontPageToPlaylist, 86400000);
