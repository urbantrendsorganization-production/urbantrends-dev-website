import base64
import hashlib

from cryptography.fernet import Fernet
from django.conf import settings


def _get_fernet():
    key = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
    return Fernet(base64.urlsafe_b64encode(key))


def encrypt_token(value: str) -> str:
    if not value:
        return value
    return _get_fernet().encrypt(value.encode()).decode()


def decrypt_token(value: str) -> str:
    if not value:
        return value
    try:
        return _get_fernet().decrypt(value.encode()).decode()
    except Exception:
        return value
