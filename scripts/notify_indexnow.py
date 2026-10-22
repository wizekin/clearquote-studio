#!/usr/bin/env python3
"""Submit only newly added/updated canonical ClearQuote pages to IndexNow.

Runs after successful Firebase deployment. Uses only Python standard library.
The key is public by design; host its key.txt at the same website origin.
IndexNow is independent of Google Search Console.
"""
from __future__ import annotations

import json
import subprocess
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

HOST = "wizekin.web.app"
ORIGIN = f"https://{HOST}"
KEY = "6b3793f9ef8f49a0c793825596b91023"
KEY_FILE = f"public/{KEY}.txt"
SITEMAP_FILE = Path("public/clearquote/sitemap.xml")


def changed_paths() -> set[str]:
    result = subprocess.run(
        ["git", "diff", "--name-only", "HEAD^", "HEAD"],
        capture_output=True, text=True, check=True
    )
    return set(result.stdout.splitlines())


def sitemap_urls() -> list[str]:
    root = ET.parse(SITEMAP_FILE).getroot()
    xmlns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [
        e.text.strip()
        for e in root.findall("s:url/s:loc", xmlns)
        if e.text and e.text.strip().startswith(f"{ORIGIN}/clearquote/")
    ]
    return sorted(set(urls))


def canonical_url(source_path: str) -> str | None:
    if not source_path.startswith("public/clearquote/") or not source_path.endswith(".html"):
        return None
    if source_path == "public/clearquote/index.html":
        return f"{ORIGIN}/clearquote/"
    return ORIGIN + "/" + source_path.removeprefix("public/")


def main() -> int:
    changed = changed_paths()
    allowed = sitemap_urls()
    if KEY_FILE in changed or "scripts/notify_indexnow.py" in changed:
        urls = allowed  # One-time setup: notify all the newly deployed site pages.
    else:
        urls = sorted(
            {u for path in changed if (u := canonical_url(path)) and u in allowed}
        )
    if not urls:
        print("No changed indexable HTML pages; skipping IndexNow.")
        return 0
    body = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": f"{ORIGIN}/{KEY}.txt",
        "urlList": urls,
    }).encode("utf-8")
    request = urllib.request.Request(
        "https://api.indexnow.org/indexnow", data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            code = response.status
            print(f"IndexNow HTTP {code}; submitted {len(urls)} changed pages.")
            for u in urls:
                print(f"- {u}")
            return 0 if code in (200, 202) else 1
    except urllib.error.HTTPError as exc:
        print(f"IndexNow HTTP {exc.code}; pages were not confirmed submitted.")
        return 1
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"IndexNow request failed: {exc!s}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
