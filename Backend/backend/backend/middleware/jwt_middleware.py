import jwt
import base64

def jwt_middleware(get_response):
    def middleware(request):
        print "All headers: %s" % request.META
        auth_header = request.META.get("Authorization")
        print "Auth: %s" % base64.b64decode(auth_header)
        encoded_token = request.META.get('HTTP_X_AUTH_TOKEN')
        if encoded_token:
            decoded_token = jwt.decode(
                encoded_token,
                auth_header,
                algorithms=['HS256']
            )
        else:
            print "No auth_header."

        print "MIDDLEWARE: Decoded token: %s" % decoded_token

        response = get_response(request)
        return response

    return middleware
