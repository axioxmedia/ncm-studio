#!/usr/bin/env python3
"""Local helper for NCM Studio. Bind 127.0.0.1 only. Stdlib only."""
from __future__ import annotations

import json
import os
import sys
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
PREF_FILE = ROOT / "ncm-studio-prefs.json"
HOST = "127.0.0.1"
PORT = int(os.environ.get("PORT", "8765"))


def load_prefs() -> dict:
    if PREF_FILE.exists():
        try:
            return json.loads(PREF_FILE.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def save_prefs(data: dict) -> dict:
    cur = load_prefs()
    cur.update(data or {})
    PREF_FILE.write_text(json.dumps(cur, ensure_ascii=False, indent=2), encoding="utf-8")
    return cur


def safe_dir(raw: str) -> Path:
    if not raw or not str(raw).strip():
        raise ValueError("empty path")
    p = Path(raw).expanduser()
    p = p.resolve()
    if not p.exists() or not p.is_dir():
        raise ValueError("not a directory")
    return p


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("[ncm-studio] " + (fmt % args) + "\n")

    def _json(self, code: int, obj: dict) -> None:
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self) -> dict:
        n = int(self.headers.get("Content-Length") or 0)
        if n <= 0:
            return {}
        raw = self.rfile.read(n)
        if not raw:
            return {}
        return json.loads(raw.decode("utf-8"))

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/status":
            prefs = load_prefs()
            self._json(200, {
                "ok": True,
                "version": "1.2.0",
                "host": HOST,
                "port": PORT,
                "prefs": prefs,
            })
            return
        if path == "/api/prefs":
            self._json(200, {"ok": True, "prefs": load_prefs()})
            return
        if path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        try:
            if path == "/api/prefs":
                data = self._read_json()
                allowed = {
                    "sourcePath", "exportPath", "deleteSource", "format",
                    "writeMeta", "mode", "remember",
                }
                slim = {k: data[k] for k in allowed if k in data}
                self._json(200, {"ok": True, "prefs": save_prefs(slim)})
                return
            if path == "/api/scan":
                data = self._read_json()
                folder = safe_dir(data.get("path", ""))
                files = []
                for child in sorted(folder.iterdir(), key=lambda p: p.name.lower()):
                    if child.is_file() and child.suffix.lower() == ".ncm":
                        files.append({
                            "name": child.name,
                            "path": str(child),
                            "size": child.stat().st_size,
                        })
                self._json(200, {"ok": True, "path": str(folder), "files": files})
                return
            if path == "/api/read":
                data = self._read_json()
                fp = Path(data.get("path", "")).expanduser().resolve()
                if not fp.is_file() or fp.suffix.lower() != ".ncm":
                    raise ValueError("not an ncm file")
                blob = fp.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "application/octet-stream")
                self.send_header("Content-Length", str(len(blob)))
                self.send_header("X-File-Name", fp.name.encode("latin-1", "replace").decode("latin-1"))
                self.end_headers()
                self.wfile.write(blob)
                return
            if path == "/api/write":
                from urllib.parse import parse_qs
                q = parse_qs(urlparse(self.path).query)
                directory = (q.get("dir") or [self.headers.get("X-Dir") or ""])[0]
                name = (q.get("name") or [self.headers.get("X-Name") or ""])[0]
                folder = safe_dir(directory)
                name = Path(name).name
                if not name or name in {".", ".."}:
                    raise ValueError("bad file name")
                n = int(self.headers.get("Content-Length") or 0)
                blob = self.rfile.read(n) if n else b""
                dest = folder / name
                dest.write_bytes(blob)
                self._json(200, {"ok": True, "path": str(dest), "bytes": len(blob)})
                return
            if path == "/api/delete":
                data = self._read_json()
                fp = Path(data.get("path", "")).expanduser().resolve()
                if not fp.is_file() or fp.suffix.lower() != ".ncm":
                    raise ValueError("can only delete .ncm")
                fp.unlink()
                self._json(200, {"ok": True, "path": str(fp)})
                return
            self._json(404, {"ok": False, "error": "not found"})
        except Exception as exc:
            self._json(400, {"ok": False, "error": str(exc)})


def main() -> None:
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    url = f"http://{HOST}:{PORT}/"
    print(f"NCM Studio  {url}", flush=True)
    threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped", flush=True)


if __name__ == "__main__":
    main()
