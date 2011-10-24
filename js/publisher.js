function Publisher($, home_hash) {
    var docs={}, init=home_hash;
    function showContent(docs) {
        function displayDoc(slug) {
            for (var i=0;i<docs.length; i++) {
                if (docs[i].slug == slug) {
                    $('#doc').html(docs[i].html);
                    $('#doc').show();
                    return false;
                }
            }
        }
        function realShow(hash) {
            var show = "";
            if (hash === "") {
                // resote home elments
               $('#twitter').show();
                $('#logo').show();
                // get the data
                $.get("publisher/var/docs.json" , function (data) {
                    docs = data.sort(function(x,y) { 
                        if (x.updated<y.updated) { return 1; }
                        if (x.updated>y.updated) { return -1;}
                        return 0;
                    });
                    var t = $('#doc_table_template').html();
                    $('#docs table').html(Mustache.to_html(t, {docs: docs}));
                    // take the clicks
                    $('.hash-click').click( function (e) {
                        var url = $(this).attr('href');
                        url = url.replace(/^docs\/#/, '');
                        $.history.load(url);
                        return false;
                    });
                    // display the home screen
                    displayDoc(init);
                }, 'json');
            } else {
                show = hash;
                $('#twitter').hide();
                displayDoc(hash);
            }
            // restore the state from hash
        }
        return realShow;
    }
    return showContent(docs);
}
