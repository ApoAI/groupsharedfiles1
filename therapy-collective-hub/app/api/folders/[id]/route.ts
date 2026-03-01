import { NextResponse } from 'next/server';
import { db } from '@/db';
import { folders, resources } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await request.json();
        const [updated] = await db.update(folders)
            .set({
                name: data.name,
                emoji: data.emoji,
            })
            .where(eq(folders.id, id))
            .returning();
        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating folder:', error);
        return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        // Unlink resources from folder before deleting
        await db.update(resources)
            .set({ folderId: null })
            .where(eq(resources.folderId, id));
        await db.delete(folders).where(eq(folders.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting folder:', error);
        return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
    }
}
