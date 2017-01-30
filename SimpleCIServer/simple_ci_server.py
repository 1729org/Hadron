import web
import json
import hashlib
import os

ENV = os.environ

urls = (
  '/', 'HandleGitWebHook'
)


def check_signature(request_headers):
    raw_header = request_headers.get("environ", {})
    hashed_token = raw_header.get("HTTP_X_HUB_SIGNATURE", False)
    if not hashed_token:
        print "No X-Hub-Signature header in %s" % request_headers
        return False

    print "Received Hashed token: %s" % hashed_token
    print "Our hashed token: %s" % (
        "sha1=" + hashlib.sha1(ENV["SECRET_TOKEN"]).hexdigest()
    )

    if hashed_token == "sha1=" + hashlib.sha1(ENV["SECRET_TOKEN"]).hexdigest():
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
