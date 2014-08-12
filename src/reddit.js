reddit = require('redwrap');

function cleanPostTitle(title) {
    var newTitle = title.replace('--', '-');
    newTitle = newTitle.replace(/\(.*$/g, '');
    newTitle = newTitle.replace(/\[.*$/g, '');
    return newTitle;
}

function getTrackArtist(postTitle) {
    var cleanedTitle = cleanPostTitle(postTitle);
    var artist = cleanedTitle.split('-')[0];
    return artist ? artist.trim() : artist;
}

function getTrackTitle(postTitle) {
    var cleanedTitle = cleanPostTitle(postTitle);
    var title = cleanedTitle.split('-')[1];
    return title ? title.trim() : title;
}

exports.getFrontPage = function(callback) {
    reddit.r('listentothis').sort('hot').from('day').limit(100, function(err, data, res) {
        var tracks = [];
        data.data.children.forEach(function(item) {
            var artist = getTrackArtist(item.data.title);
            var title = getTrackTitle(item.data.title);
            if (artist && title) {
                tracks.push({
                    artist: artist,
                    title: title
                });
            }
        });
        callback(tracks);
    });
}
