:License:   BSD_
:Copyright: `The Public Knowledge Workshop`_

.. _`The Public Knowledge Workshop`: http://yeda.us
.. _BSD: LICENSE.txt

Our Knowoledge
==============

This repository holds the code and templates used to publish documents to the web. 
Currently supporting couchdb as the document store, the code fetches documents and
displayed them nicely.

Install
-------

::
 
    $ git clone https://daonb@github.com/hasadna/yeda.us.git

Activation
----------

    $ python -m SimpleHTTPServer 8000
    $ gnome-open http://localhost:8000 # or point your browser ther

Configuration
-------------

The display is based on a json file served by couchdb. To change the url of
the file by changing the 1st line in js/yedaTable.js
