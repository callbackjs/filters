from BaseHTTPServer import HTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler
from urlparse import urlparse, parse_qs
import urllib, urllib2
import shutil
import json

class ExtendedHTTPHandler(SimpleHTTPRequestHandler):
  """
  Serves files in the local directory. Acts a proxy for Flickr images.
  """

  def do_GET(self):
    """
    Handles GET requests.
    """
    if self.path.startswith('/proxy'):
      # proxy Flickr images from url query string parameter
      params = parse_qs(urlparse(self.path).query)
      flickr_handle = urllib2.urlopen(params['url'][0])

      # write response
      self.send_response(200)
      self.send_header('Content-type', 'image/jpg')
      self.end_headers()
      shutil.copyfileobj(flickr_handle, self.wfile)
    elif self.path.startswith('/search'):
      params = parse_qs(urlparse(self.path).query)
      search_term = params['term'][0]

      query_string = urllib.urlencode({
        'method': 'flickr.photos.search',
        'media': 'photos',
        'text': search_term,
        'api_key': '3cffcc97867ea6aaf3d7fa2690f0ae10',
        'format': 'json',
        'jsoncallback': 'cb'
      })

      flickr_api_handle = urllib2.urlopen(
        'https://api.flickr.com/services/rest/?' + query_string)

      flickr_data = flickr_api_handle.read()
      flickr_data = json.loads(flickr_data[3:-1])
      flickr_data = map(lambda photo:
        'http://farm%d.staticflickr.com/%s/%s_%s_z.jpg' %
        (photo['farm'], photo['server'], photo['id'], photo['secret']),
        flickr_data['photos']['photo'])

      self.send_response(200)
      self.send_header('Content-type', 'application/json')
      self.end_headers()
      self.wfile.write(json.dumps(flickr_data))
    else:
      # let SimpleHTTPRequestHandler serve static files
      return SimpleHTTPRequestHandler.do_GET(self)


# server on 0.0.0.0:8000
try:
  server = HTTPServer(('0.0.0.0', 8000), ExtendedHTTPHandler)
  print 'Serving on 127.0.0.1:8000'
  server.serve_forever()
except KeyboardInterrupt:
  server.socket.close()
