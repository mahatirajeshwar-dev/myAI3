"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type UploadPanelProps = {
  token: string;
};

type UploadResult = {
  namespace: string;
  total: number;
  uploaded: Array<{ name: string; chunks: number; fileType: string }>;
  failed: Array<{ name: string; error: string }>;
};

export function UploadPanel({ token }: UploadPanelProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [namespace, setNamespace] = useState('default');
  const [result, setResult] = useState<UploadResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpload() {
    if (!token || !files?.length) {
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      for (const file of Array.from(files)) {
        formData.append('files', file);
      }
      formData.append('namespace', namespace);

      const response = await fetch('/api/ingestion/upload', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? 'Upload failed');
      }

      setResult(payload);
    } catch (error) {
      setResult({
        namespace,
        total: files?.length ?? 0,
        uploaded: [],
        failed: [
          {
            name: 'upload',
            error: error instanceof Error ? error.message : 'Upload failed',
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-border bg-card p-3 mb-3">
      <p className="text-sm font-medium mb-2">Knowledge Base Upload (HR/SOP Docs)</p>
      <div className="flex flex-col gap-2 md:flex-row">
        <Input type="file" multiple onChange={(event) => setFiles(event.target.files)} className="md:flex-1" />
        <Input value={namespace} onChange={(event) => setNamespace(event.target.value)} placeholder="namespace" className="md:w-40" />
        <Button onClick={handleUpload} disabled={!token || !files?.length || isLoading}>
          {isLoading ? 'Uploading...' : 'Upload to Pinecone'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Supported directly: txt, md, csv, tsv, json, xml, log, doc, docx. Convert xlsx/xls/pdf/pptx to text/csv before upload.
      </p>
      {result && (
        <div className="mt-3 text-xs">
          <p>Namespace: {result.namespace} | Files: {result.total}</p>
          {!!result.uploaded.length && <p>Uploaded: {result.uploaded.map((item) => `${item.name} (${item.chunks} chunks)`).join(', ')}</p>}
          {!!result.failed.length && <p className="text-destructive">Failed: {result.failed.map((item) => `${item.name} - ${item.error}`).join(' | ')}</p>}
        </div>
      )}
    </div>
  );
}
