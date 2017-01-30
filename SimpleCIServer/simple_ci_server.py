import web
import json

urls = (
  '/', 'HandleGitWebHook'
)


def check_signature(request_json):
    print "Got JSON: %s" % request_json
    return False


class HandleGitWebHook(object):
    def POST(self):
        request_json = web.data()
        request_json = json.loads(request_json)
        if not check_signature(request_json):
            print "Bad token."
            return json.dumps({'correct_token': True})
        print "Good token."
        return json.dumps({'correct_token': True})


if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
