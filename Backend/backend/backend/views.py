import json

from . Utils.MongoRouter import MongoRouter

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

INDEX_HTML = 'index.html'

router = MongoRouter()


def get_user_board(email):
    last_visited = router.route("users").find_one({"email": email}, {"lastVisitedId": 1})["lastVisitedId"],
    last_visited = last_visited[0]
    results = router.route("users").find_one(
        {"email": email, "boards": {"$elemMatch": {"name": last_visited}}},
        {"boards": 1}
    )["boards"]
    for result in results:
        if result["name"] == last_visited:
            return result


@require_http_methods(["GET", "OPTIONS"])
def login(request):
    email = request.session.get("email", None)

    if email:
        try:
            user_board = get_user_board(email)
            if user_board:
                print "Returning: %s" % user_board
                return JsonResponse({"boards": user_board}, status=200)
            return JsonResponse({"message": "Last visited board not found"}, status=404)
        except Exception as e:
            print "No boards found or other error: %s" % unicode(e)
            return JsonResponse({"message": unicode(e)}, status=404)

    return JsonResponse({"message": "[login] No email"}, status=401)


@require_http_methods(["POST"])
def create_board(request):
    email = request.session.get("email", None)
    print "Email: %s" % email

    if email:
        try:
            board_body = json.loads(request.body)
            print "Got this board body: %s" % board_body
            return JsonResponse({"board": {}}, status=200)
        except Exception as e:
            print "Create board failed with error: %s" % unicode(e)
            return JsonResponse({"message": unicode(e)}, status=404)

    return JsonResponse({"message": "[create_board] No email"}, status=401)


'''
			Request
			method: POST,
			headers: {
				x-auth-token: token
			},
			url: /board/create,
			body: {
 				name:
			}
		Response
			status 200
				body: board
			status 403
'''