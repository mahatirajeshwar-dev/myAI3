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

export async function parseIngestionFile(file: File): Promise<ParsedIngestionFile> {
  const extension = detectExtension(file.name);

  if (textTypes.has(extension)) {
    const text = await file.text();

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

  if (extension === 'docx' || extension === 'doc' || extension === 'pdf' || extension === 'pptx') {
    throw new Error(
      `File ${file.name} uses ${extension.toUpperCase()} format. Please convert this file to .txt or .md before upload.`,
    );
  }

  throw new Error(`Unsupported file type for ${file.name}. Use txt/md/csv/tsv/json/xml/log.`);
}
