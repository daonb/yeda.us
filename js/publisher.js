function showContent(hash) {
    var docs = {}
    if(hash == "") {
        // take the clicks
        $('.hash-click').click( function (e) {
            var url = $(this).attr('href');
            url = url.replace(/^.#/, '');
            $.history.load(url);
            return false;
        })
        // get the data
        $.get("publisher/var/docs.json" , function (data) {
            docs = data.sort(function(x,y) { 
                if (x['updated']<y['updated']) return 1;
                if (x['updated']>y['updated']) return -1;
                return 0;
            });
            var t = $('#doc_table_template').html()
            $('#docs').html(Mustache.to_html(t, {docs: docs}));
        }, 'json')
    } else {
        // restore the state from hash
        // for (int i=0; i<len(docs); i++) {
            
    }
}

