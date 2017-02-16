import web
import json
import hashlib
import os
import subprocess

ENV = os.environ
if not ENV.get("SECRET_TOKEN", None):
    import copy
    ENV = copy.deepcopy(ENV)
    ENV["SECRET_TOKEN"] = ""

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

    print "Returning True because GitHub is retarded."
    return True


class HandleGitWebHook(object):
    def POST(self):
        request_headers = web.ctx
        request_json = json.loads(web.data())

        if not check_signature(request_headers):
            print "Bad token."
            return json.dumps({'correct_token': False})
        print "Good token."
        subprocess.call("git pull origin master", shell=True)
        subprocess.call(
            "cp -R /home/ubuntu/Hadron/HadronClient/dist/* /home/ubuntu/Hadron/Backend/backend/backend/frontend/built",
            shell=True
        )
        subprocess.call(
            "/home/ubuntu/Hadron/Backend/backend_env/bin/python " +
            "/home/ubuntu/Hadron/Backend/backend/manage.py " +
            "collectstatic --noinput",
            shell=True
        )

        return json.dumps({'correct_token': True})


if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
