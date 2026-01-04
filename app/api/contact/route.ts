import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Forward to backend API if configured, otherwise call relative /contact
    const apiBase = process.env['NEXT_PUBLIC_API_URL'] || '';
    const target = apiBase ? `${apiBase.replace(/\/$/, '')}/contact` : '/contact';

    const resp = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    return NextResponse.json(
      { ok: resp.ok, status: resp.status, body: text },
      { status: resp.status }
    );
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Failed to forward request' }, { status: 500 });
  }
}
