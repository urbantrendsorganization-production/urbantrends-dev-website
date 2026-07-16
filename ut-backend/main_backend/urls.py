"""
URL configuration for main_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve as serve_media

from accounts.views import geo

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('_allauth/', include('allauth.headless.urls')),
    path('api/geo', geo, name='geo'),
    path('api/', include('services.urls')),
    path('api/', include('blog.urls')),
    path('api/', include('cms.urls')),
    path('api/', include('contracts.urls')),
    path('api/', include('github_repos.urls')),
    path('api/', include('deployments.urls')),
    path('api/', include('gmail.urls')),
    path('api/', include('notifications.urls')),
    path('api/v1/agent/', include('agent_api.urls')),

    # Serve user-uploaded media in every environment. WhiteNoise only handles
    # STATIC_ROOT (and indexes at boot, so it can't serve runtime uploads), and
    # the deployed Caddy config forwards everything on api.urbantrends.dev to
    # Django — so Django itself must serve /media/. Fine for a low-traffic,
    # admin-managed marketing site; front it with a CDN/object storage if this
    # ever gets hot.
    re_path(r'^media/(?P<path>.*)$', serve_media, {'document_root': settings.MEDIA_ROOT}),
]
