import os
import re

from django.conf import settings
from django.http import JsonResponse

_VALID_CC = re.compile(r"^[A-Z]{2}$")


def geo(request):
    cc = request.META.get("HTTP_X_VERCEL_IP_COUNTRY", "").strip().upper()
    # Dev fallback: set COUNTRY_OVERRIDE=KE in .env to simulate a country
    # without Vercel headers. Only active when DEBUG=True.
    if not cc and settings.DEBUG:
        cc = os.environ.get("COUNTRY_OVERRIDE", "").upper()
    country = cc if _VALID_CC.match(cc) else None
    response = JsonResponse({"country": country})
    if country:
        response.set_cookie(
            "ut-country",
            country,
            max_age=3600,
            samesite="Lax",
            httponly=False,
        )
    return response
