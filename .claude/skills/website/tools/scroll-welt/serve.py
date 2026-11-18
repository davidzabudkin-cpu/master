# Lokale Vorschau ohne Browser-Cache (damit immer die neueste Version geladen wird)
# Aufruf: python serve.py <port> <ordner>
import sys, functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

port, root = int(sys.argv[1]), sys.argv[2]
ThreadingHTTPServer(('', port), functools.partial(NoCache, directory=root)).serve_forever()
