import json

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods


@require_http_methods(["POST"])
def login(request):
    request_headers = request.META
    request_json = json.loads(request.body)
    print "Headers: %s" % request_headers
    print "Body: %s" % request_json
    return JsonResponse({"auth": False})
