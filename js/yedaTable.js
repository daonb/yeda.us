// var ALL_DOCS_URL = "http://yeda.iriscouch.com/yeda_home/_all_docs?callback=?";
var allDocsUrl = "static/all_docs.json";
var destTemplate = $('#dest-template').html()

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
                    attr({"doc_id": doc._id}). 
                    width((doc.width)?doc.width:250).
                    height((doc.height)?doc.height:"auto").
                    html(Mustache.render(destTemplate, doc));
                $('#destinations').append(item);
            }
            // draw the logo and
            $('#logo canvas').hLogo();
            // update the grid
            $('#destinations').isotope({
                itemSelector: '.dest-item',
                transformsEnabled: false,
                masonary: {columnWidth: 100},
                sortBy: 'random'
            });
        }
    )
 })

