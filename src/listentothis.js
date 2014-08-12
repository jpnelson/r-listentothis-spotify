var spotify = require('./spotify');
var reddit = require('./reddit');

var argument = process.argv[2];
var waitForFirstAdd = (argument !== '-w');
var ONE_DAY_IN_MS = 86400000;
var timeForFirstAddInMs = waitForFirstAdd ? 0 : process.argv[3] * 60 * 1000;

function addRedditFrontPageToPlaylist() {
    reddit.getFrontPage(function(tracks) {
        spotify.searchAndAdd(tracks);
    });
}

setTimeout(function() {
    setInterval(addRedditFrontPageToPlaylist, ONE_DAY_IN_MS);
    addRedditFrontPageToPlaylist();
}, timeForFirstAddInMs);

console.log('[listentothis] Waiting ' + timeForFirstAddInMs + 'ms to start');
