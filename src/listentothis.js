var spotify = require('./spotify');
var reddit = require('./reddit');

var argument = process.argv[2];
var waitForFirstAdd = (argument !== '-w');
var ONE_DAY_IN_MS = 86400000;
var timeForFirstAddInMs = waitForFirstAdd ? 0 : process.argv[3] * 60 * 1000;

function addRedditFrontPageToPlaylist() {
    reddit.getFrontPage(function(song) {
        spotify.searchAndAdd(song.artist, song.title);
        console.log('Attempting to add ' + song.artist + ' - ' + song.title)
    });
}

setTimeout(function() {
    setInterval(addRedditFrontPageToPlaylist, ONE_DAY_IN_MS);
    addRedditFrontPageToPlaylist();
}, timeForFirstAddInMs);

console.log('Waiting ' + timeForFirstAddInMs + 'ms to start');
