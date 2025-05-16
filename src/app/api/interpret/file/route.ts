import { interpretFile } from '@/services/interpretFile'

export const runtime = 'edge'

export async function POST(request: Request) {
    try {
        const data = await request.formData()
        const file = data.get('file')
        if (!file || !(file instanceof Blob)) {
            return new Response(
                JSON.stringify({ error: 'No valid file uploaded.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }
        const result = await interpretFile(file as File)
        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } })
    } catch (error) {
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}