#!/usr/bin/env python3
import os
import sqlite3
import sys


DATA_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(os.path.dirname(DATA_DIR), "staging.db")
DATASET_PATH = os.path.join(DATA_DIR, "dataset.yml")


def fetch_all(conn: sqlite3.Connection, query: str, params: tuple = ()) -> list[sqlite3.Row]:
    cur = conn.execute(query, params)
    return cur.fetchall()


def load_dataset_sources() -> tuple[str | None, list[dict]]:
    try:
        import yaml  # type: ignore
    except ImportError as exc:
        raise SystemExit("PyYAML is required (pip install pyyaml).") from exc

    if not os.path.exists(DATASET_PATH):
        return None, []

    with open(DATASET_PATH, "r", encoding="utf-8") as handle:
        payload = yaml.safe_load(handle) or {}

    return payload.get("cycle_id"), payload.get("sources", []) or []


def main() -> int:
    if not os.path.exists(DB_PATH):
        print(f"Missing staging DB at {DB_PATH}")
        return 2

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    errors: list[str] = []
    warnings: list[str] = []
    allowed_statuses = ("won", "lost", "not_confirmed")

    try:
        fk_issues = fetch_all(conn, "PRAGMA foreign_key_check")
        if fk_issues:
            errors.append(f"Foreign key violations: {len(fk_issues)}")

        dupe_entries = fetch_all(
            conn,
            """
            SELECT cycle_id, constituency_id, list_order, COUNT(*) AS cnt
            FROM candidate_entry
            GROUP BY cycle_id, constituency_id, list_order
            HAVING cnt > 1
            """,
        )
        if dupe_entries:
            errors.append(f"Duplicate candidate_entry rows: {len(dupe_entries)} groups")

        dupe_names = fetch_all(
            conn,
            """
            SELECT ce.cycle_id, c.locality_id, p.full_name_folded, COUNT(*) AS cnt
            FROM candidate_entry ce
            JOIN person p ON p.id = ce.person_id
            JOIN constituency c ON c.id = ce.constituency_id
            GROUP BY ce.cycle_id, c.locality_id, p.full_name_folded
            HAVING cnt > 1
            """,
        )
        if dupe_names:
            warnings.append(f"Duplicate names within cycle+locality: {len(dupe_names)} groups")

        missing_required = fetch_all(
            conn,
            """
            SELECT ce.id
            FROM candidate_entry ce
            JOIN person p ON p.id = ce.person_id
            WHERE p.full_name IS NULL OR TRIM(p.full_name) = ""
               OR ce.constituency_id IS NULL
               OR ce.list_order IS NULL
            """,
        )
        if missing_required:
            errors.append(f"Missing key fields on candidate_entry: {len(missing_required)}")

        missing_sources = fetch_all(
            conn,
            """
            SELECT ce.id
            FROM candidate_entry ce
            LEFT JOIN source s
              ON s.record_type = 'candidate_entry' AND s.record_id = ce.id
            WHERE s.id IS NULL
            """,
        )
        if missing_sources:
            warnings.append(f"Candidate entries missing sources: {len(missing_sources)}")

        missing_results_match = fetch_all(
            conn,
            """
            SELECT id
            FROM election_result_candidate
            WHERE candidate_entry_id IS NULL
            """,
        )
        if missing_results_match:
            errors.append(
                f"Election result candidates missing candidate_entry match: {len(missing_results_match)}"
            )

        invalid_statuses = fetch_all(
            conn,
            """
            SELECT id, status
            FROM election_result_candidate_annotation
            WHERE status NOT IN (?, ?, ?)
            """,
            allowed_statuses,
        )
        if invalid_statuses:
            errors.append(
                f"Election result annotations with invalid status: {len(invalid_statuses)}"
            )

        missing_annotations = fetch_all(
            conn,
            """
            SELECT erc.id
            FROM election_result_candidate erc
            LEFT JOIN election_result_candidate_annotation erca
              ON erca.result_id = erc.id
            WHERE erca.id IS NULL
            """,
        )
        if missing_annotations:
            errors.append(
                f"Election result candidates missing annotations: {len(missing_annotations)}"
            )

        document_count = fetch_all(conn, "SELECT COUNT(*) AS cnt FROM document")
        if document_count and document_count[0]["cnt"] == 0:
            warnings.append("No documents recorded in document table")

        dataset_cycle_id, dataset_sources = load_dataset_sources()
        for source in dataset_sources:
            source_id = source.get("id", "unknown-source")
            document_id = source.get("document_id")
            terms_status = source.get("terms_status")
            terms_checked_at = source.get("terms_checked_at")
            if not document_id:
                errors.append(f"dataset.yml source missing document_id: {source_id}")
                continue
            if not terms_status:
                errors.append(f"dataset.yml source missing terms_status: {source_id}")
            if not terms_checked_at:
                errors.append(f"dataset.yml source missing terms_checked_at: {source_id}")

            doc_exists = fetch_all(
                conn, "SELECT id FROM document WHERE id = ?", (document_id,)
            )
            if not doc_exists:
                errors.append(f"dataset.yml document_id not in document table: {document_id}")

            terms_exists = fetch_all(
                conn,
                """
                SELECT id
                FROM document_terms
                WHERE document_id = ?
                  AND (cycle_id = ? OR cycle_id IS NULL)
                """,
                (document_id, dataset_cycle_id),
            )
            if not terms_exists:
                errors.append(
                    f"document_terms missing for dataset.yml document_id: {document_id}"
                )
    finally:
        conn.close()

    if warnings:
        print("WARNINGS:")
        for item in warnings:
            print(f"- {item}")
    if errors:
        print("ERRORS:")
        for item in errors:
            print(f"- {item}")

    if errors:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
