import { NextResponse } from 'next/server';
import { db } from '@/db';
import { resources } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { type } = await request.json();

    if (type !== 'like' && type !== 'love') {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    const field = type === 'like' ? resources.likeCount : resources.loveCount;

    const [updatedResource] = await db.update(resources)
      .set({
        [type === 'like' ? 'likeCount' : 'loveCount']: sql`${field} + 1`,
      })
      .where(eq(resources.id, id))
      .returning();

    return NextResponse.json({
      likeCount: updatedResource.likeCount,
      loveCount: updatedResource.loveCount,
    });
  } catch (error) {
    console.error('Error reacting:', error);
    return NextResponse.json({ error: 'Failed to react' }, { status: 500 });
  }
}
