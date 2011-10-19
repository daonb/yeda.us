var Publisher = {
    docs: {},
    showContent: function (hash) {
        if (hash === "") {
            // resote home elments
            $('#twitter').show();
            $('#logo').show();
            $('#doc').hide();
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
            }, 'json');
        } else {
            // restore the state from hash
            for (var i=0;i<docs.length; i++) {
                if (docs[i].slug == hash) {
                    $('#doc').html(docs[i].html);
                    $('#twitter').hide();
                    $('#logo').hide();
                    $('#doc').show();
                    return false;
                }
            }
        }
    }
}
