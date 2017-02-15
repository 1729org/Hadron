import base64
from .. Utils.MongoRouter import MongoRouter

from django.http import JsonResponse


def jwt_middleware(get_response):
    mongo_router = MongoRouter()

    def middleware(request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if auth_header:
            # ToDo: Refactor as a login method
            email = base64.b64decode(auth_header)
            user_record = mongo_router.route("users").find_one({'email': email})

            if not user_record:
                print "No record found for: %s" % email
                return JsonResponse({"message": "No record found for: %s" % email}, status=401)
            else:
                print "Found: %s" % user_record
                request.session.update({"email": email})
                request.session.save()
                response = get_response(request)
                return response
        elif request.method == "OPTIONS":
            print "OPTIONS call"
            response = get_response(request)
            return response

        return JsonResponse({"message": "[jwt_middleware] No auth_header"}, status=401)

    return middleware