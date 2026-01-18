import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiBase = process.env['NEXT_PUBLIC_API_URL'] || '';
    const target = apiBase ? `${apiBase.replace(/\/+$/, '')}/notifications/unsubscribe` : '/notifications/unsubscribe';

    const resp = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    if (resp.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json(JSON.parse(text), { status: resp.status });
    }
    return new NextResponse(text, { status: resp.status });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Failed to forward unsubscribe' }, { status: 500 });
  }
}
