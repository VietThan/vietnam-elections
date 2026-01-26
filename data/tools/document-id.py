#!/usr/bin/env python3
import argparse
import hashlib


def make_id(prefix: str, raw: str) -> str:
    digest = hashlib.sha1(raw.encode("utf-8")).hexdigest()[:12]
    return f"{prefix}{digest}"


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Compute document_id using doc_type and url/path/title."
    )
    parser.add_argument("--doc-type", required=True, help="Document type (e.g. pdf, docx, web)")
    parser.add_argument("--file-path", help="File path used by build-staging-db.py")
    parser.add_argument("--url", help="Document URL")
    parser.add_argument("--title", help="Document title (fallback only)")
    args = parser.parse_args()

    doc_key = args.file_path or args.url or args.title
    if not doc_key:
        raise SystemExit("Provide --file-path, --url, or --title.")

    raw = f"{args.doc_type}|{doc_key}"
    print(make_id("doc-", raw))


if __name__ == "__main__":
    main()
