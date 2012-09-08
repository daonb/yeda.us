var allDocsUrl = "http://yeda.iriscouch.com/yeda_home/_all_docs?callback=?";
var destDocTemplate = $('#dest-doc-template').html();
var destDocDetailsTemplate = $('#dest-doc-details-template').html();
var destLinkTemplate = $('#dest-link-template').html();
var com1Template = $('#com1-template').html();
var fadingMsec = 100;
var docPrefix = ['doc', 'spr'];

function generateHash(slug) {
    if (slug)
        return ""+slug
    else
        return "";
}
// Generate a fully qualified url for a given slug
function generate_url(slug) {
    return "http://#"+window.location.host+"#"+xgenerate_hash(slug);
}

// Change page's hash - this is the way we keep (and update) our current state
function update_history(slug) {
    setTimeout(function (slug) {
        window.location.hash = generate_hash(slug);
        }, 0, slug);
}

function clr() {
    $('#com1').html('');
    $('.item:visible').hide();
    $('.item-details:visible').hide();
    window.scrollTo(0,0);
}

$.Isotope.prototype._positionAbs = function( x, y ) {
  return { right: x, top: y };
};

$(document).ready(function () {
        $('#com1').html(Mustache.render(com1Template, {payload: "בטעינה"})).show();
        function move() {
            var slug = window.location.hash.slice(1);
            update_history(slug);
            if (slug.length > 0) {
                clr();
                $('.item-details[doc_id|="'+slug+'"]"').fadeToggle(fadingMsec);
            }
            else {
                clr();
                $('.item').fadeToggle(fadingMsec);
            }

        }
        window.onhashchange = move;

        $.getJSON (allDocsUrl,
                   {include_docs: true},
                   function (data) {
            // got the data, time to create the divs...
            for (var i=0; i < data.rows.length; i++) {
                var doc = data.rows[i].doc;
                if (!doc.hasOwnProperty("url"))
                    doc.url = "/#"+data.rows[i].id;
                var item = $(document.createElement('div')).
// new item is brought to the table
addClass("item").
attr({"doc_id": "/#"+doc._id,
      "doc_updated": (doc.hasOwnProperty('updated'))?doc.updated:'unknown'
     }).
width((doc.width)?doc.width:250).
height((doc.height)?doc.height:"auto");
                //
                // use the a template based on doc and link types
                // TODO: add a doc_type field to the DB
                if (docPrefix.indexOf(doc._id.substr(0,3)) != -1) {
                    // we've got a doc. let's render the thumb and 
                    item.html(Mustache.render(destDocTemplate, doc));
                    $('#items').append(item);
                    // create an item-details div
                    doc.url = "https://docs.google.com/document/d/"+doc._id.slice("document:".length);
                    $('#items').append($(document.createElement('div')).
hide().
addClass("item-details").
attr({"doc_id": doc._id }).
html(Mustache.render(destDocDetailsTemplate, doc))
                    );
                }
                else {
                    // we've got a shallow div just give it a thumb
                    item.html(Mustache.render(destLinkTemplate, doc));
                    $('#items').append(item);
                }

            };
            // update the grid
            $('#items').isotope({
                itemSelector: '.item',
                transformsEnabled: false,
                masonry: {columnWidth: 1},
                getSortData : {
                    'updated' : function ( $elem ) {
                        return $elem.attr('doc_updated');
                    },
                    'title' : function ($elem) {
                        return $elem.children('h1').html();
                    }
                },
                // sortAscending: false,
                onLayout: function ( $elems ) {
                    $('#com1').html('');
                },
                sortBy: 'title'
            });
        }
    )
});
