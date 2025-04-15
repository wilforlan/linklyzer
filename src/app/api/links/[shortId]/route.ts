import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get a specific link info
export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  try {
    const { shortId } = params;

    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('shortId', shortId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ link: data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Delete a link and its analytics
export async function DELETE(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  try {
    const { shortId } = params;

    // First, find the link to get its ID
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('id')
      .eq('shortId', shortId)
      .single();

    if (linkError || !link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Delete associated analytics
    await supabase
      .from('analytics')
      .delete()
      .eq('linkId', link.id);

    // Delete the link
    const { error: deleteError } = await supabase
      .from('links')
      .delete()
      .eq('id', link.id);

    if (deleteError) {
      console.error('Error deleting link:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete link' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 