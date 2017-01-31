import jwt

def jwt_middleware(get_response):
    def middleware(request):
        encoded_token = request.META.get('HTTP_X_AUTH_TOKEN')
        decoded_token = jwt.decode(
            encoded_token,
            'secret',
            algorithms=['HS256']
        )

        print "MIDDLEWARE: Decoded token: %s" % decoded_token

        response = get_response(request)
        return response

    return middleware
