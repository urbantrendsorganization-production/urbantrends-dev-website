"""Deterministic quote engine — the load-bearing guardrail.

The model never sets a price. Mika sends validated params; this module computes
the authoritative amount + itemised breakdown, server-side, from admin-authored
rules. ``amount`` always equals the sum of the breakdown lines.

Pricing rules JSON (on ``AgentServiceConfig.pricing_rules``)::

    {
      "base": "25000",
      "base_label": "Base landing page",
      "rules": [
        {"kind": "per_unit", "field": "pages", "label": "Extra pages",
         "unit": "8000", "included": 1},
        {"kind": "flag", "field": "copywriting", "label": "Copywriting",
         "amount": "12000"},
        {"kind": "enum", "field": "tier", "label": "Tier",
         "amounts": {"standard": "10000", "premium": "25000"}}
      ]
    }

When a service has no ``pricing_rules``, the engine falls back to the cheapest
fixed :class:`services.PricingPlan` as a flat base. If neither exists, it raises
:class:`QuoteUnavailable` (fail closed on money).
"""
from decimal import Decimal

from services.models import Service


class QuoteUnavailable(Exception):
    """No deterministic price can be produced for this service."""


def _d(value) -> Decimal:
    return value if isinstance(value, Decimal) else Decimal(str(value))


def compute(service: Service, params: dict) -> list[dict]:
    """Return the priced ``breakdown`` — a list of ``{label, amount}`` (amounts
    as :class:`~decimal.Decimal`). Callers format to whole-shilling strings."""
    config = getattr(service, 'agent_config', None)
    rules_cfg = config.pricing_rules if config else None

    if rules_cfg and (rules_cfg.get('base') is not None or rules_cfg.get('rules')):
        return _from_rules(service, rules_cfg, params)

    return _from_plans(service)


def _from_rules(service: Service, cfg: dict, params: dict) -> list[dict]:
    breakdown: list[dict] = []

    base = _d(cfg.get('base', '0'))
    base_label = cfg.get('base_label') or f'Base {service.name.lower()}'
    breakdown.append({'label': base_label, 'amount': base})

    for rule in cfg.get('rules', []):
        kind = rule.get('kind')
        field = rule.get('field')
        value = params.get(field)

        if kind == 'per_unit':
            included = int(rule.get('included', 0))
            qty = max(0, int(value or 0) - included)
            if qty <= 0:
                continue
            unit = _d(rule.get('unit', '0'))
            label = f"{rule.get('label', field)} ×{qty}"
            breakdown.append({'label': label, 'amount': unit * qty})

        elif kind == 'flag':
            if bool(value):
                breakdown.append({
                    'label': rule.get('label', field),
                    'amount': _d(rule.get('amount', '0')),
                })

        elif kind == 'enum':
            amounts = rule.get('amounts', {})
            if value in amounts:
                add = _d(amounts[value])
                if add != 0:
                    breakdown.append({
                        'label': f"{rule.get('label', field)}: {value}",
                        'amount': add,
                    })

    return breakdown


def _from_plans(service: Service) -> list[dict]:
    """Fallback: cheapest fixed-price plan as a flat base line."""
    plan = (
        service.plans
        .filter(is_quote=False, price__isnull=False)
        .order_by('price')
        .first()
    )
    if plan is None:
        raise QuoteUnavailable(
            f'No pricing rules or fixed plan for "{service.name}".'
        )
    label = plan.name or f'{service.name} — {plan.get_tier_display() or "base"}'
    return [{'label': label, 'amount': _d(plan.price)}]
