import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  try {
    const { shortId } = params;

    // First, find the link
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('shortId', shortId)
      .single();

    if (linkError || !link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Get analytics data
    const { data: analytics, error: analyticsError } = await supabase
      .from('analytics')
      .select('*')
      .eq('linkId', link.id)
      .order('timestamp', { ascending: false });

    if (analyticsError) {
      console.error('Error fetching analytics:', analyticsError);
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: 500 }
      );
    }

    // Calculate summary statistics
    const totalVisits = analytics.length;
    
    // Count unique IPs
    const uniqueIps = new Set(
      analytics.map(record => record.visitorIp).filter(Boolean)
    ).size;
    
    // Count visits by device
    const deviceCounts = analytics.reduce((acc: Record<string, number>, item) => {
      const device = item.device || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});
    
    // Count visits by country
    const countryCounts = analytics.reduce((acc: Record<string, number>, item) => {
      const country = item.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    // Count visits by referrer
    const refererCounts = analytics.reduce((acc: Record<string, number>, item) => {
      const referer = item.referer || 'Direct';
      acc[referer] = (acc[referer] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      link,
      analytics: {
        totalVisits,
        uniqueVisitors: uniqueIps,
        devices: deviceCounts,
        countries: countryCounts,
        referers: refererCounts,
        visits: analytics.map(visit => ({
          timestamp: visit.timestamp,
          device: visit.device,
          country: visit.country,
          city: visit.city
        })),
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 