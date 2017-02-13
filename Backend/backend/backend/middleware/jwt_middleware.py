import jwt
import base64
from pymongo import MongoClient

from django.http import HttpResponse


def jwt_middleware(get_response):
    client = MongoClient()

    def middleware(request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if auth_header:
            db = client["users_db"]
            collection = db["users_db"]

            email = base64.b64decode(auth_header)
            user_record = collection.find_one({'email': email})
            if not user_record:
                print "No record found for: %s" % email
                return HttpResponse('[0] Unauthorized', status=401)
            else:
                print "Found: %s" % user_record
                request.user.is_authenticated = True
                response = get_response(request)
                return response

        encoded_token = request.META.get('HTTP_X_AUTH_TOKEN')
        if encoded_token:
            decoded_token = jwt.decode(
                encoded_token,
                auth_header,
                algorithms=['HS256']
            )
        else:
            print "No auth_header."

        return HttpResponse('[1] Unauthorized', status=401)

    return middleware
