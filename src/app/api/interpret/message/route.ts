import { interpretMessage } from '@/services/interpretMessage';

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const content = data.content;
        const history = data.history;
        if (!content) {
            return new Response(
                JSON.stringify({ error: 'No valid content uploaded.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        const result = await interpretMessage(history, content);
        return new Response(JSON.stringify({ text: result }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}