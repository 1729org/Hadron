from . Utils.MongoRouter import MongoRouter

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

router = MongoRouter()


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