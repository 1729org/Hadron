import web
import json
import hashlib
import os

ENV = os.environ

urls = (
  '/', 'HandleGitWebHook'
)


def check_signature(request_headers):
    try:
        print request_headers.keys()
    except:
        print "That don't work son!"


    raw_header = request_headers.get("environ", {})

    print "Raw header: %s" % raw_header

    header = raw_header.get("HTTP_X_HUB_SIGNATURE", False)

    if not header:
        print "No X-Hub-Signature header in %s" % request_headers
        return False
    hashed_token = request_headers["X-Hub-Signature"]
    print "Hashed token: %s" % hashed_token
    print "Our hashed token: %s" % hashlib.sha1(ENV["SECRET_TOKEN"]).hexdigest()

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
