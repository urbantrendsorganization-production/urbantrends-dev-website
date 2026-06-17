from datetime import timedelta
from decimal import Decimal

from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from django.views import View

from .models import Receipt


class ReceiptDownloadView(View):
    def get(self, request, token):
        receipt = get_object_or_404(
            Receipt.objects.select_related('client', 'deployment').prefetch_related('repos__account'),
            download_token=token,
        )
        if receipt.sent_at and timezone.now() - receipt.sent_at > timedelta(days=90):
            return HttpResponse('This receipt link has expired.', status=410)

        items = []
        for item in (receipt.line_items or []):
            qty        = Decimal(str(item.get('qty', 1)))
            unit_price = Decimal(str(item.get('unit_price', 0)))
            items.append({
                'description': item.get('description', ''),
                'qty':        int(qty) if qty == int(qty) else qty,
                'unit_price': f"{unit_price:,.2f}",
                'line_total': f"{qty * unit_price:,.2f}",
            })
        response = render(request, 'contracts/receipt.html', {
            'receipt':     receipt,
            'items':       items,
            'subtotal_fmt': f"{receipt.subtotal:,.2f}",
            'tax_fmt':      f"{receipt.tax_amount:,.2f}",
            'total_fmt':    f"{receipt.total:,.2f}",
        })
        response['Referrer-Policy'] = 'no-referrer'
        return response
