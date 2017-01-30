import web
import json
import hashlib
import os

ENV = os.environ

urls = (
  '/', 'HandleGitWebHook'
)


def check_signature(request_headers):
    if not request_headers.get("X-Hub-Signature", False):
        print "No X-Hub-Signature header in %s" % request_headers
        return False
    hashed_token = request_headers["X-Hub-Signature"]
    print "Hashed token: %s" % hashed_token
    print "Our hashed token: %s" % hashlib.new(ENV["SECRET_TOKEN"]).hexdigest()

    if hashed_token == hashlib.new(ENV["SECRET_TOKEN"]).hexdigest():
        return True
    return False


class HandleGitWebHook(object):
    def POST(self):
        request_headers = web.ctx
        request_json = json.loads(web.data())

        if not check_signature(request_headers):
            print "Bad token."
            return json.dumps({'correct_token': False})
        print "Good token."
        return json.dumps({'correct_token': True})


if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
