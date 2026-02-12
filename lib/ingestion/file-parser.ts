import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export type ParsedIngestionFile = {
  text: string;
  fileType: string;
};

const textTypes = new Set([
  'txt',
  'md',
  'markdown',
  'csv',
  'tsv',
  'json',
  'log',
  'xml',
]);

function detectExtension(filename: string): string {
  const split = filename.toLowerCase().split('.');
  return split.length > 1 ? split[split.length - 1] : '';
}

function normalizeExtractedText(text: string): string {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\u0000/g, ' ')
    .trim();
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const tempDir = await mkdtemp(join(tmpdir(), 'aira-docx-'));

  try {
    const docxPath = join(tempDir, 'input.docx');
    await writeFile(docxPath, buffer);

    const { stdout } = await execFileAsync('unzip', ['-p', docxPath, 'word/document.xml'], {
      maxBuffer: 10 * 1024 * 1024,
    });

    return normalizeExtractedText(stdout);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function extractDocText(buffer: Buffer): Promise<string> {
  const tempDir = await mkdtemp(join(tmpdir(), 'aira-doc-'));

  try {
    const docPath = join(tempDir, 'input.doc');
    await writeFile(docPath, buffer);

    const { stdout } = await execFileAsync('strings', [docPath], {
      maxBuffer: 10 * 1024 * 1024,
    });

    return normalizeExtractedText(stdout);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

export async function parseIngestionFile(file: File): Promise<ParsedIngestionFile> {
  const extension = detectExtension(file.name);

  if (textTypes.has(extension)) {
    const text = await file.text();

    return {
      text,
      fileType: extension,
    };
  }

  if (extension === 'docx') {
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractDocxText(buffer);

    if (!text) {
      throw new Error(`Could not extract readable text from ${file.name}.`);
    }

    return {
      text,
      fileType: extension,
    };
  }

  if (extension === 'doc') {
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractDocText(buffer);

    if (!text) {
      throw new Error(`Could not extract readable text from ${file.name}.`);
    }

    return {
      text,
      fileType: extension,
    };
  }

  if (extension === 'xlsx' || extension === 'xls') {
    throw new Error(
      `Excel file ${file.name} is not directly parseable in this environment. Please export it to CSV and upload the CSV version.`,
    );
  }

  if (extension === 'pdf' || extension === 'pptx') {
    throw new Error(
      `File ${file.name} uses ${extension.toUpperCase()} format. Please convert this file to .txt or .md before upload.`,
    );
  }

  throw new Error(`Unsupported file type for ${file.name}. Use txt/md/csv/tsv/json/xml/log/doc/docx.`);
}
