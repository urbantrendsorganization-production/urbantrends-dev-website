"""Requirement-form schemas and server-side validation.

Mika renders the returned ``form`` verbatim and validates the collected params
before quoting; this module is the backend authority for both the schema and the
validation, so Mika and the backend agree on what "valid params" means.

Field schema (matches the contract §2):
    type ∈ {integer, boolean, enum, string}
    optional: min, max (integer), options (enum), required, default
"""
from services.models import Service


class ParamError(Exception):
    """Raised when submitted params fail validation. ``fields`` maps
    field-name → human reason, surfaced as a 422 error envelope."""
    def __init__(self, fields: dict):
        self.fields = fields
        super().__init__('invalid params')


def default_form(service: Service) -> dict:
    """A generic brief form for services without an explicit schema."""
    return {
        'service': service.slug,
        'title': f'{service.name} — project brief',
        'fields': [
            {
                'name': 'requirements',
                'type': 'string',
                'label': 'Tell us what you need',
                'required': True,
            },
        ],
    }


def form_for(service: Service) -> dict:
    """The form schema for a service — its configured one, or the default."""
    config = getattr(service, 'agent_config', None)
    if config and config.form and config.form.get('fields'):
        form = dict(config.form)
        form.setdefault('service', service.slug)
        form.setdefault('title', f'{service.name} — project brief')
        return form
    return default_form(service)


def _coerce_bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        if value.lower() in ('true', '1', 'yes', 'on'):
            return True
        if value.lower() in ('false', '0', 'no', 'off', ''):
            return False
    if value in (0, 1):
        return bool(value)
    raise ValueError


def validate_params(form: dict, params: dict) -> dict:
    """Validate ``params`` against ``form``; return a cleaned dict or raise
    :class:`ParamError`. Unknown fields are dropped, not rejected."""
    params = params or {}
    fields = form.get('fields', [])
    cleaned: dict = {}
    errors: dict = {}

    for field in fields:
        name = field['name']
        ftype = field.get('type', 'string')
        required = field.get('required', False)
        present = name in params and params[name] not in (None, '')

        if not present:
            if 'default' in field:
                cleaned[name] = field['default']
            elif required:
                errors[name] = 'This field is required.'
            continue

        raw = params[name]

        if ftype == 'integer':
            try:
                val = int(raw)
            except (TypeError, ValueError):
                errors[name] = 'Must be a whole number.'
                continue
            lo, hi = field.get('min'), field.get('max')
            if lo is not None and val < lo:
                errors[name] = f'Must be at least {lo}.'
                continue
            if hi is not None and val > hi:
                errors[name] = f'Must be at most {hi}.'
                continue
            cleaned[name] = val

        elif ftype == 'boolean':
            try:
                cleaned[name] = _coerce_bool(raw)
            except ValueError:
                errors[name] = 'Must be true or false.'

        elif ftype == 'enum':
            options = field.get('options', [])
            allowed = [o['value'] if isinstance(o, dict) else o for o in options]
            if raw not in allowed:
                errors[name] = f'Must be one of: {", ".join(map(str, allowed))}.'
            else:
                cleaned[name] = raw

        else:  # string
            cleaned[name] = str(raw)

    if errors:
        raise ParamError(errors)
    return cleaned
