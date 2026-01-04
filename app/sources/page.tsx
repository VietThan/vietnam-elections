import fs from "node:fs/promises";
import path from "node:path";

type DocumentsPayload = {
  cycle_id: string;
  generated_at: string;
  records: Array<{
    id: string;
    title: string;
    url: string | null;
    file_path: string | null;
    doc_type: string | null;
    published_date: string | null;
    fetched_date: string | null;
    notes: string | null;
  }>;
};

async function readDocuments(): Promise<DocumentsPayload | null> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    "elections",
    "na15-2021",
    "documents.json"
  );
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as DocumentsPayload;
  } catch {
    return null;
  }
}

function formatDate(value: string | null): string {
  if (!value) {
    return "Unknown";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString("en-US");
}

export default async function SourcesPage() {
  const documents = await readDocuments();
  const records = documents?.records ?? [];

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.25)]">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Sources</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">Official documents</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600">
          Every factual field is tied to a published source. This registry lists the
          baseline documents used for the 2021 cycle.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-zinc-500">
          Tat ca thong tin deu co nguon. Danh sach ben duoi la tai lieu co ban.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">National Assembly 15 (2021)</h2>
        <div className="mt-4 grid gap-3 text-sm text-zinc-600">
          {records.map((doc) => (
            <div key={doc.id} className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-3">
              <p className="font-semibold text-zinc-900">{doc.title}</p>
              <p className="mt-1 text-xs text-zinc-500">
                Fetched: {formatDate(doc.fetched_date)}
              </p>
              {doc.url && (
                <a
                  className="mt-2 inline-flex text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-600"
                  href={doc.url}
                >
                  Open source
                </a>
              )}
            </div>
          ))}
          {records.length === 0 && (
            <p className="text-sm text-zinc-500">No documents published yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
