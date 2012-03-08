// var ALL_DOCS_URL = "http://yeda.iriscouch.com/yeda_home/_all_docs?callback=?";
var allDocsUrl = "static/all_docs.json";
var destDocTemplate = $('#dest-doc-template').html()
var destLinkTemplate = $('#dest-link-template').html()
var docPrefix = ['doc', 'spr'];

$.Isotope.prototype._positionAbs = function( x, y ) {
  return { right: x, top: y };
};

$(document).ready(function () {
        $.getJSON (allDocsUrl,
        {include_docs: true},
        function (data) {
            // got the data, time to create the divs...
            for (var i=0; i<data.rows.length; i++) {
                var doc = data.rows[i].doc;
                var item = $(document.createElement('div')).
                    addClass("dest-item").
                    attr({"doc_id": doc._id, 
                          "doc_updated": (doc.hasOwnProperty('updated'))?doc.updated:'AAAA'
                         }). 
                    width((doc.width)?doc.width:250).
                    height((doc.height)?doc.height:"auto");
                // use the a template based on the doc type 
                // TODO: add a doc_type field to the DB
                if (docPrefix.indexOf(doc._id.substr(0,3)) != -1)
                    item.html(Mustache.render(destDocTemplate, doc));
                else
                    item.html(Mustache.render(destLinkTemplate, doc));
                $('#destinations').append(item);
            }
            // draw the logo and
            $('#logo canvas').hLogo();
            // update the grid
            $('#destinations').isotope({
                itemSelector: '.dest-item',
                transformsEnabled: false,
                masonry: {columnWidth: 100},
                getSortData : {
                    'updated' : function ( $elem ) {
                        return $elem.attr('doc_updated');
                    }
                },
                // sortAscending: false,
                sortBy: 'updated'
            });
        }
    )
 })

