import { NextResponse } from 'next/server';
import { db } from '@/db';
import { folders } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
    try {
        const allFolders = await db.query.folders.findMany({
            with: { resources: true },
            orderBy: [desc(folders.createdAt)],
        });
        return NextResponse.json(allFolders);
    } catch (error) {
        console.error('Error fetching folders:', error);
        return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const [newFolder] = await db.insert(folders).values({
            name: data.name,
            emoji: data.emoji || '📁',
        }).returning();
        return NextResponse.json(newFolder);
    } catch (error) {
        console.error('Error creating folder:', error);
        return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
    }
}
