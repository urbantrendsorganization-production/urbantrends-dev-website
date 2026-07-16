"""Agent API routes. Mounted at ``/api/v1/agent/`` in main_backend/urls.py."""
from django.urls import path

from .views import (
    CustomerMeView,
    KBArticlesView,
    OrderDetailView,
    OrdersMineView,
    OrdersView,
    QuoteView,
    ServiceDetailView,
    ServicesView,
    SitemapView,
    TicketDetailView,
    TicketsView,
)

urlpatterns = [
    # §2 Catalog
    path('services', ServicesView.as_view(), name='agent-services'),
    path('services/<slug:key>', ServiceDetailView.as_view(), name='agent-service-detail'),
    # §3 Quote
    path('services/<slug:key>/quote', QuoteView.as_view(), name='agent-quote'),
    # §4 Orders
    path('orders', OrdersView.as_view(), name='agent-orders'),
    path('orders/mine', OrdersMineView.as_view(), name='agent-orders-mine'),
    path('orders/<str:ref>', OrderDetailView.as_view(), name='agent-order-detail'),
    # §5 Knowledge base
    path('kb/articles', KBArticlesView.as_view(), name='agent-kb-articles'),
    # §6 Sitemap
    path('sitemap', SitemapView.as_view(), name='agent-sitemap'),
    # §7 Tickets
    path('tickets', TicketsView.as_view(), name='agent-tickets'),
    path('tickets/<str:ref>', TicketDetailView.as_view(), name='agent-ticket-detail'),
    # §1 Optional enrichment
    path('customers/me', CustomerMeView.as_view(), name='agent-customer-me'),
]
