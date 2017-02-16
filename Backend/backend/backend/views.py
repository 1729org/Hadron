from . Utils.MongoRouter import MongoRouter

from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods
from django.core.files.storage import get_storage_class

from . import settings

INDEX_HTML = 'index.html'

router = MongoRouter()


def main(request):
    storage_class = get_storage_class(settings.STATICFILES_STORAGE)
    with storage_class().open(INDEX_HTML) as index_file:
        html_content = index_file.read()
    return HttpResponse(html_content)


@require_http_methods(["GET", "OPTIONS"])
def login(request):
    email = request.session.get("email", None)

    if email:
        try:
            user_board = sorted(
                router.route("users").find_one({"email": email}, {"boards": 1}),
                key=lambda k: k["lastModifiedDate"]
            )[0]
            print "Returning: %s" % user_board
            return JsonResponse({"boards": user_board}, status=200)
        except Exception as e:
            print "No boards found or other error: %s" % unicode(e)
            return JsonResponse({"message": unicode(e)}, status=404)

    return JsonResponse({"message": "[login] No email"}, status=401)


def create_board():
    return JsonResponse({"message": "soon"}, status=200)