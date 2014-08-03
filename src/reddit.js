reddit = require('redwrap');

function cleanTitle(title) {
    var newTitle = title.replace('--', '-');
    newTitle = newTitle.replace(/\(.*$/g, '');
    newTitle = newTitle.replace(/\[.*$/g, '');
    return newTitle;
}

function getArtist(title) {
    var newTitle = cleanTitle(title);
    var artist = newTitle.split('-')[0];
    return artist ? artist.trim() : artist;
}

function getTrackName(title) {
    var newTitle = cleanTitle(title);
    var track = newTitle.split('-')[1];
    return track ? track.trim() : track;
}

exports.getFrontPage = function(callback) {
    reddit.r('listentothis').sort('hot').from('day').limit(100, function(err, data, res){
        data.data.children.forEach(function(item) {
            var artist = getArtist(item.data.title);
            var title = getTrackName(item.data.title);
            if (artist && title) {
                callback({
                    artist: artist,
                    title: title
                });
            }
        });
    });
}
