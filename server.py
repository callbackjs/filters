from BaseHTTPServer import HTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler
from urlparse import urlparse, parse_qs
import urllib, urllib2
import shutil
import json

# in-memory comments database for simplicity
comments = []

class ExtendedHTTPHandler(SimpleHTTPRequestHandler):
  """
  Serves files in the local directory. Acts a proxy for Flickr images.
  """

  def __init__(self, *args, **kwargs):
    """
    Creates an ExtendedHTTPHandler that serves comments.
    """
    SimpleHTTPRequestHandler.__init__(self, *args, **kwargs)


  def do_GET(self):
    """
    Handles GET requests.
    """
    if self.path == '/comments':
      self.send_response(200)
      self.send_header('Content-type', 'application/json')
      self.end_headers()
      self.wfile.write(json.dumps(comments))
    else:
      # let SimpleHTTPRequestHandler serve static files
      return SimpleHTTPRequestHandler.do_GET(self)

  def do_POST(self):
    """
    Handles POST requests.
    """
    if self.path == '/comments':
      length = int(self.headers.getheader('content-length', 0))
      try:
        data = json.loads(self.rfile.read(length))
      except ValueError:
        self.send_response(422)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        error = {'error': 'Must provide a valid json body.'}
        self.wfile.write(json.dumps(error))
        return

      name = data.get('name')
      message = data.get('message')

      if (name is None or message is None or
          not isinstance(name, basestring) or not isinstance(message, basestring) or
          name == '' or message == ''):
        self.send_response(422)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        error = {'error': 'Must provide a valid name and message.'}
        self.wfile.write(json.dumps(error))
      else:
        comments.append({'name': name, 'message': message})
        self.send_response(200)
        self.end_headers()

        success = {}
        self.wfile.write(json.dumps(success))
    else:
      return SimpleHTTPRequestHandler.do_POST(self)


# server on 0.0.0.0:8000
try:
  server = HTTPServer(('0.0.0.0', 8000), ExtendedHTTPHandler)
  print 'Serving on 127.0.0.1:8000'
  server.serve_forever()
except KeyboardInterrupt:
  server.socket.close()
