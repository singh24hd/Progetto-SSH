import asyncio
import tornado.ioloop
import tornado.web
import os

class MainHandler(tornado.web.RequestHandler):
   def get(self):
        self.write({"message": "API response /!"})

class LoginHandler(tornado.web.RequestHandler):
   def get(self):
        self.write({"message": "API response! /log"})


class SignUpHandler(tornado.web.RequestHandler):
    def get(self):
        self.write({"message": "API response! /sing"})
class VerifyEmailHandler(tornado.web.RequestHandler):
    def get(self):
        self.write({"message": "API response! /mail"})

from tornado.options import define, options

define("port", default=8888, help="Run on the given port", type=int)

# ✅ Percorso assoluto per i file statici e le pagine HTML
BASE_DIR = os.path.dirname(__file__)
STATIC_DIR = os.path.join(BASE_DIR, "public")
TEMPLATE_DIR = os.path.join(BASE_DIR, "src")


# ✅ Configura l'applicazione Tornado
def make_app():
    return tornado.web.Application(
        [
            (r"/", MainHandler),
            (r"/login", LoginHandler),
            (r"/signup", SignUpHandler),
            (r"/verificaemail", VerifyEmailHandler),
            (r"/(.*)", tornado.web.StaticFileHandler, {"path": STATIC_DIR}),  # Serve i file statici
        ],
        debug=True,
    )

async def main():
    tornado.options.parse_command_line()
    app = make_app()
    app.listen(options.port)
    print(f"🚀 Server running at http://localhost:{options.port}")
    await asyncio.Event().wait()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServer stopped. Bye!")

