from django.shortcuts import get_object_or_404, render
from django.views import View

from .models import Receipt


class ReceiptDownloadView(View):
    def get(self, request, token):
        receipt = get_object_or_404(Receipt, download_token=token)
        items = []
        for item in (receipt.line_items or []):
            qty        = float(item.get('qty', 1))
            unit_price = float(item.get('unit_price', 0))
            items.append({
                'description': item.get('description', ''),
                'qty':        int(qty) if qty == int(qty) else qty,
                'unit_price': f"{unit_price:,.2f}",
                'line_total': f"{qty * unit_price:,.2f}",
            })
        return render(request, 'contracts/receipt.html', {
            'receipt':     receipt,
            'items':       items,
            'subtotal_fmt': f"{receipt.subtotal:,.2f}",
            'tax_fmt':      f"{receipt.tax_amount:,.2f}",
            'total_fmt':    f"{receipt.total:,.2f}",
        })
