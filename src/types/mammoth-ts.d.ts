declare module 'mammoth-ts' {
  export interface ExtractResult {
    value: string;
    messages: any[];
  }

  export interface ExtractOptions {
    arrayBuffer: ArrayBuffer;
  }

  export function extractText(options: ExtractOptions): Promise<ExtractResult>;
  export function extractRawText(options: ExtractOptions): Promise<ExtractResult>;
}