import os
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2] / "backend"
sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("IS_SERVERLESS", "true")

from a2wsgi import WSGIMiddleware  # noqa: E402
from app.main import app as fastapi_app  # noqa: E402

application: WSGIMiddleware = WSGIMiddleware(fastapi_app)


def app(environ, start_response):
    # Vercel may drop the original sub-path when rewriting /api/* to this
    # single catch-all function. Recover it when the runtime passes it.
    if environ.get("PATH_INFO", "/") == "/api/index.py":
        original = environ.get("HTTP_X_VC_PATH", "").lstrip("/")
        if original:
            environ["PATH_INFO"] = "/" + original
    return application(environ, start_response)