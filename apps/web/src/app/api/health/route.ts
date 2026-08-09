import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    app: 'Cari & Kasa Finance Web API Server',
    timestamp: new Date().toISOString(),
  });
}
