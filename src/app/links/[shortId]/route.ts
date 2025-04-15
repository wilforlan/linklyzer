import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { parseUserAgent } from '@/lib/link-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  try {
    const { shortId } = params;

    // Get the link from the database
    const { data: link, error } = await supabase
      .from('links')
      .select('*')
      .eq('shortId', shortId)
      .single();

    if (error || !link) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Track the analytics
    const clientIp = request.headers.get('x-forwarded-for') || null;
    const userAgent = request.headers.get('user-agent');
    const referer = request.headers.get('referer');
    const device = parseUserAgent(userAgent);
    
    // Attempt to get geolocation info
    let country = null;
    let city = null;
    
    // In a real implementation, you might use a geolocation service or 
    // rely on headers from a CDN like Cloudflare

    // Store analytics data
    await supabase.from('analytics').insert({
      linkId: link.id,
      visitorIp: clientIp,
      userAgent,
      referer,
      timestamp: new Date().toISOString(),
      country,
      city,
      device,
    });

    // Redirect to the original URL
    return NextResponse.redirect(link.originalUrl);
  } catch (error) {
    console.error('Error handling redirect:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
} 