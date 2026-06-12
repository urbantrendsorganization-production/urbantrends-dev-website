from django.urls import path
from .views import ReceiptDownloadView

urlpatterns = [
    path('contracts/receipt/<uuid:token>', ReceiptDownloadView.as_view(), name='receipt-download'),
]
