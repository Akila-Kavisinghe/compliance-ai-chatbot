import { generateText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { ChatRole, PII, PIIType } from '@/types';

// Using Gemini because it is only model I have free credits for that supports tools and pdfs
export const model = google('gemini-1.5-flash');

const systemPrompt = `
You are a helpful assistant for extracting Personally Identifiable Information (PII) from files.

You will be given a file (image or PDF). Your task is to scan the file and return a JSON object with a property "PIIs", which is an array of detected PII items. Each item must have:
- value: The exact PII string as found in the file.
- type: The PII type, one of: EMAIL, PHONE, SOCIAL_SECURITY, CREDIT_CARD, NAME.
- page: The page number where the PII was found (start at 1 for the first page).

Detection Guidelines for each PII type:

MOST IMPORTANT: Do not make up a PII that is not present in the file if you do not have enough information to do so. If you cannot find one set value to "".

EMAIL:
- Look for patterns like "user@domain.com"
- Common in contact information, signatures, or forms
- May appear in headers, footers, or contact sections
- Often preceded by labels like "Email:", "E-mail:", or "Contact:"

PHONE:
- Look for patterns like "(123) 456-7890", "123-456-7890", or "+1 123-456-7890"
- Common in contact information, business cards, or forms
- May include country codes (e.g., +1, +44)
- Often preceded by labels like "Phone:", "Tel:", or "Mobile:"

SOCIAL_SECURITY:
- Look for patterns like "123-45-6789" or "123 45 6789"
- Common in tax documents, employment forms, or medical records
- May be partially masked (e.g., "XXX-XX-1234")
- Often preceded by labels like "SSN:", "Social Security:", or "SS#"

CREDIT_CARD:
- Look for patterns like "4111 1111 1111 1111" or "4111-1111-1111-1111"
- Common in receipts, invoices, or payment forms
- May be partially masked (e.g., "**** **** **** 1234")
- Often preceded by labels like "Card:", "CC:", or "Credit Card:"

NAME:
- Look for proper nouns that appear to be personal names
- Common in signatures, headers, or contact information
- May include titles (e.g., "Dr.", "Mr.", "Ms.")
- Often appear in pairs (first and last name)
- Consider context to distinguish from other proper nouns

For each potential PII you find:
1. Call the validatePII tool to verify if it matches the expected format
2. Be thorough but avoid false positives
3. Consider the context and surrounding text
4. Pay attention to formatting and presentation
`;

const getContent = (file: File, arrayBuffer: ArrayBuffer) => {
    const mimeType = file.type;
    if (mimeType.startsWith('image/'))
        return { type: 'image' as const, image: arrayBuffer, mimeType };
    if (mimeType === 'application/pdf')
        return { type: 'file' as const, data: arrayBuffer, mimeType };
    return null;
};

const validators = {
    [PIIType.EMAIL]: {
        validate: (value: string) => /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value)
    },
    [PIIType.PHONE]: {
        validate: (value: string) => /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(value)
    },
    [PIIType.SOCIAL_SECURITY]: {
        validate: (value: string) => /^((?!000|666|9\d{2})\d{3}[- ]?(?!00)\d{2}[- ]?(?!0000)\d{4}|(?!000000000)\d{3}[- ]?\d{3}[- ]?\d{3})$/.test(value)
    },
    [PIIType.CREDIT_CARD]: {
        validate: (value: string) => {
            const digits = value.replace(/\D/g, '');
            return /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(digits);
        }
    },
    [PIIType.NAME]: {
        validate: (value: string) => /^[A-Za-z][A-Za-z''-]+(?: [A-Za-z][A-Za-z'']+)*$/.test(value)
    }
};

const validatePIIValue = (pii: PII, piis: PII[]) => {
    const { value, type, page } = pii;
    if (value === '') return;
    const isValid = validators[type].validate(value);
    if (isValid) piis.push({ value, type, page });
};

export async function interpretFile(file: File): Promise<PII[]> {
    const arrayBuffer = await file.arrayBuffer();
    const content = getContent(file, arrayBuffer);
    if (!content) throw new Error('Unsupported file type');

    const piis: PII[] = [];
    await generateText({
        model,
        tools: {
            validatePII: tool({
                description: 'Validates a PII value against its type',
                parameters: z.object({
                    value: z.string().describe('The value of the PII'),
                    type: z.nativeEnum(PIIType).describe('The type of PII'),
                    page: z.number().describe('The page number of the PII')
                }),
                execute: async (pii: PII) => validatePIIValue(pii, piis)
            }),
        },
        toolChoice: 'required',
        system: systemPrompt,
        messages: [{ role: ChatRole.USER, content: [content] }]
    });

    return piis;
}
