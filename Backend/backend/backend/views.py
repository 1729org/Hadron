import json

from django.http import HttpResponse
from django.http import JsonResponse

from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required


@require_http_methods(["GET"])
@login_required
def login(request):
    request_headers = request.META
    print "Headers: %s" % request_headers
    return HttpResponse('All good', status=200)
