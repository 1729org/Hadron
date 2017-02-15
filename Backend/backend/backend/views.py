import base64

from . Utils.MongoRouter import MongoRouter

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

router = MongoRouter()


@require_http_methods(["GET"])
def login(request):
    auth_header = request.META.get("HTTP_AUTHORIZATION")
    if auth_header:
        email = base64.b64decode(auth_header)
        user_boards = sorted(
            router.route("users").find_one({"email": email}, {"boards": 1}),
            key=lambda k: k["lastModifiedDate"]
        )
        return JsonResponse({"boards": user_boards}, status=200)
    return JsonResponse({"message": "[login] No auth_header"}, status=401)


def create_board():
    return JsonResponse({"message": "soon"}, status=200)