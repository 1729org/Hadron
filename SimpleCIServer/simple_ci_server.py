import web
import json

urls = (
  '/', 'HandleGitWebHook'
)

class HandleGitWebHook(object):
    def GET(self):
        return json.dumps({'received': True, 'action': 'update_script'})


if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
