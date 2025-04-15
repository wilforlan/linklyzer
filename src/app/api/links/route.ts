import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateShortId, isValidUrl, formatUrl } from '@/lib/link-utils';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    const formattedUrl = formatUrl(url);
    const shortId = generateShortId();

    // Insert the link into Supabase
    const { data, error } = await supabase
      .from('links')
      .insert({
        shortId,
        originalUrl: formattedUrl,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating link:', error);
      return NextResponse.json(
        { error: 'Failed to create link' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      link: data,
      shortUrl: `${req.nextUrl.origin}/links/${shortId}`
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 