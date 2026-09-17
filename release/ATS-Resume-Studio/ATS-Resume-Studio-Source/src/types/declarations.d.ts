declare module 'pdfjs-dist/build/pdf.mjs' {
  const content: any;
  export = content;
}

declare module 'mammoth' {
  export function extractRawText(options: { arrayBuffer: ArrayBuffer }): Promise<{ value: string; messages: any[] }>;
}
