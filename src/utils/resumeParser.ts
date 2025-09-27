import { extractText } from 'mammoth-ts';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Set worker source for pdfjs
// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

export interface ExtractedFields {
  name: string | null;
  email: string | null;
  phone: string | null;
  fullText: string;
}

const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
};

const extractTextFromDOCX = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await extractText({ arrayBuffer });
  return result.value;
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.pdf')) {
    return await extractTextFromPDF(file);
  } else if (fileName.endsWith('.docx')) {
    return await extractTextFromDOCX(file);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }
};

export const extractFields = (text: string): ExtractedFields => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
  const nameRegex = /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m;

  const lines = text.split('\n').filter(line => line.trim());

  let name: string | null = null;
  let email: string | null = null;
  let phone: string | null = null;

  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    email = emailMatch[0];
  }

  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    phone = phoneMatch[0].replace(/[^\d+]/g, '').replace(/^1/, '');
    if (phone.length === 10) {
      phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
  }

  for (const line of lines.slice(0, 5)) {
    const nameMatch = line.match(nameRegex);
    if (nameMatch && !emailRegex.test(line) && !phoneRegex.test(line)) {
      name = nameMatch[0].trim();
      break;
    }
  }

  return {
    name,
    email,
    phone,
    fullText: text
  };
};

export const getMissingFields = (fields: ExtractedFields): string[] => {
  const missing: string[] = [];

  if (!fields.name) missing.push('name');
  if (!fields.email) missing.push('email');
  if (!fields.phone) missing.push('phone');

  return missing;
};