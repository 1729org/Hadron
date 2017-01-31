import json

from django.http import HttpResponse
from django.http import JsonResponse

from django.views.decorators.http import require_http_methods


@require_http_methods(["GET"])
def login(request):
    request_headers = request.META
    print "Headers: %s" % request_headers
    return HttpResponse('Unauthorized', status=401)
