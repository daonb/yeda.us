#*-encoding:utf8-*
#!/usr/bin/python
#
# Copyright (C) 2007, 2009 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

OWNER_EMAIL = 'bennydaon@gmail.com'
ROOT_FOLDER = u'הסדנא'.encode('utf8')

__author__ = ('daonb (Benny Daon)',
             )


import sys
import re
import os.path
import getopt
import json
import getpass
import gdata.docs.service
import gdata.spreadsheet.service

from slugify_hebrew import slugify

def truncate(content, length=15, suffix='...'):
  if len(content) <= length:
    return content
  else:
    return content[:length] + suffix


class DocsPublisher(object):
  """A DocsSample object demonstrates the Document List feed."""

  def __init__(self, email, password, old):
    """Constructor for the DocsSample object.

    Takes an email and password corresponding to a gmail account to
    demonstrate the functionality of the Document List feed.

    Args:
      email: [string] The e-mail address of the account to use for the sample.
      password: [string] The password corresponding to the account specified by
          the email parameter.

    Returns:
      A DocsSample object used to run the sample demonstrating the
      functionality of the Document List feed.
    """
    source = 'Document List Python Sample'
    self.gd_client = gdata.docs.service.DocsService()
    self.gd_client.ClientLogin(email, password, source=source)

    # Setup a spreadsheets service for downloading spreadsheets
    self.gs_client = gdata.spreadsheet.service.SpreadsheetsService()
    self.gs_client.ClientLogin(email, password, source=source)
    self.docs = {}
    for i in old:
        self.docs[i['resource_id']] = i

  def _ParseFeed(self, feed, context):
    """Prints out the contents of a feed to the console.

    Args:
      feed: A gdata.docs.DocumentListFeed instance.
    """
    for entry in feed.entry:
        up = entry.updated.text
        i = entry.resourceId.text
        categories = map(lambda x: x.label, entry.category)

        try:
            old = self.docs[i]
        except KeyError:
            old = None

        if 'starred' in categories and (not old or up > old['updated']):
            doc = context.copy()
            doc['authors'] = map(lambda x: x.name.text, entry.author)
            doc['resource_id'] = entry.resourceId.text
            doc['type'] = entry.GetDocumentType()
            doc['title'] = entry.title.text.decode('utf8')
            doc['slug'] = slugify(doc['title'])
            doc['updated'] = entry.updated.text
            doc['categoreis'] = categories
            print doc['resource_id']
            if doc['type']=='document':
                self.gd_client.Export(entry, "temp.html")
            else:
                docs_token = self.gd_client.GetClientLoginToken()
                self.gd_client.SetClientLoginToken(self.gs_client.GetClientLoginToken())
                self.gd_client.Export(entry, "temp.html", gid=0)
                self.gd_client.SetClientLoginToken(docs_token)
            f = open("temp.html", "r")
            doc['html'] = re.search('<body.*?>(.*)</body>', f.read(), re.DOTALL).group(1).decode('utf8')
            f.close()
            self.docs[i] = doc

  def publish_docs(self, folder=ROOT_FOLDER):
    """Retrieves and displays a list of documents based on the user's choice."""
    print 'Retrieve documents and spreadsheets from %s' % folder

    query = gdata.docs.service.DocumentQuery(categories=['folder'], params={'showfolders': 'true'})
    query.AddNamedFolder(OWNER_EMAIL, folder)
    feed = self.gd_client.Query(query.ToUri())
    for entry in feed.entry:
        folder_name = entry.title.text
        print "*** %s:" % folder_name
        for cat in ['starred']: #['document', 'spreadsheet']:
            query = gdata.docs.service.DocumentQuery() #categories=[cat, ],)
            query.AddNamedFolder(OWNER_EMAIL, folder_name)
            feed = self.gd_client.Query(query.ToUri())
            path = '%s/%s' % (folder, folder_name)
            self._ParseFeed(feed, {'path':path.decode('utf8')})
    return json.dumps(self.docs)
