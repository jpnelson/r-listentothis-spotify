reddit = require('redwrap');

function cleanTitle(title) {
    var newTitle = title.replace('--', '-');
    newTitle = newTitle.replace(/\(.*$/g, '');
    newTitle = newTitle.replace(/\[.*$/g, '');
    return newTitle;
}

function getArtist(title) {
    var newTitle = cleanTitle(title);
    return newTitle.split('-')[0];
}

function getTrackName(title) {
    var newTitle = cleanTitle(title);
    return newTitle.split('-')[1];
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
