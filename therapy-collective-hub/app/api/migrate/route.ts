import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET() {
    try {
        // Add og_image column if it doesn't exist
        await db.execute(sql`
      ALTER TABLE resources ADD COLUMN IF NOT EXISTS og_image text
    `);
        return NextResponse.json({ success: true, message: 'Migration completed: og_image column added' });
    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 });
    }
}
