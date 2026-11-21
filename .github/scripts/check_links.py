#!/usr/bin/env python3
"""Check every link in a built copy of the site.

Internal links must exist in the build. External links must answer without a
client or server error. Hosts that block automated requests are reported as
unchecked rather than broken, because their answer says nothing about the link.

Usage: python3 .github/scripts/check_links.py _site
"""

import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

SITE_URL = "https://jpripamonti.github.io"
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/140.0 Safari/537.36"
)
TIMEOUT = 30
ATTEMPTS = 3

# Hosts that answer automated requests with a block page, a bot challenge, or a
# rate limit. Their replies are reported, never counted as failures.
GUARDED_HOSTS = {
    "www.linkedin.com",
    "www.sciencedirect.com",
    "dataverse.harvard.edu",
    "scholar.google.com",
    # Answers from a browser and from a Mac, but GitHub's runners get no reply.
    "marroninstitute.nyu.edu",
}


class LinkFinder(HTMLParser):
    ATTRS = {"href", "src"}

    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in self.ATTRS and value:
                self.links.append(value)


def collect(build: Path):
    """Map every link found in the build to the pages it appears on."""
    found = {}
    for page in sorted(build.rglob("*.html")):
        parser = LinkFinder()
        parser.feed(page.read_text(encoding="utf-8", errors="replace"))
        for link in parser.links:
            link = link.strip()
            if not link or link.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
                continue
            # Links are written against the deployed site, not the build path.
            absolute = urljoin(SITE_URL + "/", link)
            found.setdefault(absolute, set()).add(page.relative_to(build).as_posix())
    return found


def check_internal(url: str, build: Path) -> str | None:
    path = unquote(urlparse(url).path)
    target = build / path.lstrip("/")
    if target.is_dir():
        target = target / "index.html"
    if target.exists():
        return None
    if not path.rstrip("/").split("/")[-1].count("."):
        # Extensionless page URLs are served from their .html file.
        if (build / (path.strip("/") + ".html")).exists():
            return None
    return "missing from the build"


def check_external(url: str) -> tuple[str, str | None]:
    last = "no reply"
    for attempt in range(ATTEMPTS):
        for method in ("HEAD", "GET"):
            request = urllib.request.Request(
                url, method=method, headers={"User-Agent": USER_AGENT}
            )
            try:
                with urllib.request.urlopen(request, timeout=TIMEOUT) as reply:
                    if reply.status < 400:
                        return "ok", None
                    last = f"HTTP {reply.status}"
            except urllib.error.HTTPError as error:
                if error.code < 400:
                    return "ok", None
                last = f"HTTP {error.code}"
                if error.code in (403, 405, 429, 999) and method == "HEAD":
                    continue  # Some servers refuse HEAD but serve GET.
            except Exception as error:  # timeouts, DNS, TLS
                last = type(error).__name__
    host = urlparse(url).hostname or ""
    if host in GUARDED_HOSTS:
        return "unchecked", last
    return "broken", last


def main() -> int:
    build = Path(sys.argv[1] if len(sys.argv) > 1 else "_site")
    if not build.is_dir():
        print(f"No build at {build}. Run jekyll build first.")
        return 2

    links = collect(build)
    internal = {u: p for u, p in links.items() if u.startswith(SITE_URL)}
    external = {u: p for u, p in links.items() if not u.startswith(SITE_URL)}
    broken, unchecked = [], []

    for url, pages in sorted(internal.items()):
        problem = check_internal(url, build)
        if not problem:
            continue
        # Some same-origin links point at other repositories published under
        # this account, which this build does not contain. Ask the live site.
        state, detail = check_external(url)
        if state == "broken":
            broken.append((url, f"{problem}, and the live site answers {detail}", pages))
        elif state == "unchecked":
            unchecked.append((url, detail))

    for url, pages in sorted(external.items()):
        state, detail = check_external(url)
        if state == "broken":
            broken.append((url, detail, pages))
        elif state == "unchecked":
            unchecked.append((url, detail))

    print(f"Checked {len(internal)} internal and {len(external)} external links.")
    if unchecked:
        print("\nUnchecked, because the host blocks automated requests:")
        for url, detail in unchecked:
            print(f"  {url} ({detail})")
    if broken:
        print("\nBroken:")
        for url, detail, pages in broken:
            print(f"  {url} ({detail}) — linked from {', '.join(sorted(pages))}")
        return 1
    print("\nNo broken links.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
