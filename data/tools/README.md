# Data tools

## document-id.py
Compute a deterministic document_id used by the staging DB.

Examples:
```bash
python3 data/tools/document-id.py --doc-type pdf --file-path data/na15-2021/congressional-units.pdf
python3 data/tools/document-id.py --doc-type web --url https://example.com/page
```
