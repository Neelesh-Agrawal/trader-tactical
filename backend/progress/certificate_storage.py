from pathlib import Path

from django.conf import settings
from django.core.files.base import ContentFile


FALLBACK_DUMMY_PNG_BYTES = bytes.fromhex(
    "89504E470D0A1A0A"
    "0000000D49484452000000010000000108060000001F15C489"
    "0000000A49444154789C6360000000020001E221BC33"
    "0000000049454E44AE426082"
)


class BaseCertificateStorage:
    backend_name = "local"

    def load_dummy_image(self):
        raise NotImplementedError

    def save_certificate(self, certificate, filename):
        raise NotImplementedError


class LocalCertificateStorage(BaseCertificateStorage):
    backend_name = "local"

    def load_dummy_image(self):
        configured_path = getattr(
            settings,
            "DUMMY_CERTIFICATE_PNG_PATH",
            str(Path(settings.MEDIA_ROOT) / "certificates" / "dummy.png"),
        )
        path = Path(configured_path)
        if path.exists() and path.is_file():
            return path.read_bytes()
        return FALLBACK_DUMMY_PNG_BYTES

    def save_certificate(self, certificate, filename):
        image_bytes = self.load_dummy_image()
        certificate.image_file.save(filename, ContentFile(image_bytes), save=True)


def get_certificate_storage():
    backend = getattr(settings, "CERTIFICATE_STORAGE_BACKEND", "local")
    if backend == "local":
        return LocalCertificateStorage()
    raise ValueError(f"Unsupported certificate storage backend: {backend}")
