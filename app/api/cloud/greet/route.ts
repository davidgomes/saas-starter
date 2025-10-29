import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const greeting = request.nextUrl.searchParams.get('greeting') || 'hi';
  
  return NextResponse.json({
    message: `Howdy! ${greeting} cloud!`,
    timestamp: new Date().toISOString(),
    service: 'cloud-greet-service'
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { greeting = 'hi', name } = body;
    
    const response = name 
      ? `Howdy, ${name}! ${greeting} cloud!`
      : `Howdy! ${greeting} cloud!`;
    
    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
      service: 'cloud-greet-service'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
