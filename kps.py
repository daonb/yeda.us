#*-encoding:utf8-*
#!/usr/bin/python

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

from publisher.slugify_hebrew import slugify
from publisher import DocsPublisher

def main():
  # Parse command line options
  try:
    opts, args = getopt.getopt(sys.argv[1:], '', ['user=', 'pw='])
  except getopt.error, msg:
    print 'python pkw.py --user [google username] --pw [password] '
    sys.exit(2)

  user = ''
  pw = ''
  key = ''
  # Process options
  for option, arg in opts:
    if option == '--user':
      user = arg
    elif option == '--pw':
      pw = arg

  while not user:
    print 'NOTE: Please enter your goole account info'
    user = raw_input('Please enter your username: ')
  while not pw:
    pw = getpass.getpass()
    if not pw:
      print 'Password cannot be blank.'

  try:
      f = open("var/docs.json", "r")

      try:
          old = json.load(f)
      except ValueError:
          old = []

      f.close()
  except IOError:
      old = []
      
  try:
    pub = DocsPublisher(user, pw, old)
  except gdata.service.BadAuthentication:
    print 'Invalid user credentials given.'
    return

  pub.update_docs()
  if pub.updated:
      print 'updating output file...'
      f = open("var/docs.json", "w")
      f.write(pub.to_json())
      f.close()

if __name__ == '__main__':
  main()
