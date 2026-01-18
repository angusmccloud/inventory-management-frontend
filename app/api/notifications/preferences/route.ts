import { NextResponse } from 'next/server';

async function forward(target: string, init: RequestInit) {
  const resp = await fetch(target, init);
  const text = await resp.text();
  const contentType = resp.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return NextResponse.json(JSON.parse(text), { status: resp.status });
    } catch (e) {
      return NextResponse.json({ ok: resp.ok, status: resp.status, body: text }, { status: resp.status });
    }
  }
  return new NextResponse(text, { status: resp.status });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const familyId = url.searchParams.get('familyId');
  const memberId = url.searchParams.get('memberId');

  if (!familyId || !memberId) {
    return NextResponse.json({ ok: false, error: 'Missing familyId or memberId' }, { status: 400 });
  }

  const apiBase = process.env['NEXT_PUBLIC_API_URL'] || '';
  const target = apiBase
    ? `${apiBase.replace(/\/+$/, '')}/families/${familyId}/members/${memberId}/preferences/notifications`
    : `/families/${familyId}/members/${memberId}/preferences/notifications`;

  const headers: Record<string, string> = {};
  const auth = request.headers.get('authorization');
  const cookie = request.headers.get('cookie');
  if (auth) headers['authorization'] = auth;
  if (cookie) headers['cookie'] = cookie;

  return forward(target, { method: 'GET', headers });
}

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const familyId = url.searchParams.get('familyId');
  const memberId = url.searchParams.get('memberId');

  if (!familyId || !memberId) {
    return NextResponse.json({ ok: false, error: 'Missing familyId or memberId' }, { status: 400 });
  }

  const apiBase = process.env['NEXT_PUBLIC_API_URL'] || '';
  const target = apiBase
    ? `${apiBase.replace(/\/+$/, '')}/families/${familyId}/members/${memberId}/preferences/notifications`
    : `/families/${familyId}/members/${memberId}/preferences/notifications`;

  const body = await request.text();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const auth = request.headers.get('authorization');
  const cookie = request.headers.get('cookie');
  if (auth) headers['authorization'] = auth;
  if (cookie) headers['cookie'] = cookie;

  return forward(target, { method: 'PATCH', headers, body });
}
