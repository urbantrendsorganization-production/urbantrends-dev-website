from django.urls import path

from .views import (
    AnalyticsView,
    OrderDetailView,
    OrderInvoiceView,
    OrderListCreateView,
    OrderMessageListCreateView,
    OrderStaffUpdateView,
    QuoteRequestView,
    ServiceDetailView,
    ServiceListView,
)

urlpatterns = [
    path('analytics',      AnalyticsView.as_view(),   name='analytics'),
    path('services/quote', QuoteRequestView.as_view(), name='quote-request'),
    path('services', ServiceListView.as_view(), name='service-list'),
    path('services/<slug:slug>', ServiceDetailView.as_view(), name='service-detail'),
    path('orders', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<int:pk>/update', OrderStaffUpdateView.as_view(), name='order-staff-update'),
    path('orders/<int:pk>/invoice', OrderInvoiceView.as_view(), name='order-invoice'),
    path('orders/<int:pk>/messages', OrderMessageListCreateView.as_view(), name='order-messages'),
]
