var spotify = require('./spotify');
var reddit = require('./reddit');

var argument = process.argv[2];
var addOnBoot = (argument !== '-s');

function addRedditFrontPageToPlaylist() {
    reddit.getFrontPage(function(song) {
        spotify.searchAndAdd(song.artist, song.title);
        console.log('Attempting to add ' + song.artist + ' - ' + song.title)
    });
}

setInterval(addRedditFrontPageToPlaylist, 86400000);
if (addOnBoot) {
    addRedditFrontPageToPlaylist();
}
