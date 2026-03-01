import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { CATEGORIES } from '@/lib/config';

export async function GET() {
    try {
        const dbCategories = await db.select().from(categories).orderBy(asc(categories.name));
        const dbNames = dbCategories.map(c => c.name);
        // Merge defaults + custom, deduplicated
        const allNames = [...new Set([...CATEGORIES, ...dbNames])].sort();
        return NextResponse.json(allNames);
    } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to defaults
        return NextResponse.json(CATEGORIES);
    }
}

export async function POST(request: Request) {
    try {
        const { name } = await request.json();
        if (!name?.trim()) {
            return NextResponse.json({ error: 'Category name required' }, { status: 400 });
        }
        const [created] = await db.insert(categories).values({
            name: name.trim(),
        }).onConflictDoNothing().returning();

        return NextResponse.json(created || { name: name.trim(), existing: true });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');
        if (!name) {
            return NextResponse.json({ error: 'Category name required' }, { status: 400 });
        }
        // Only delete custom categories (those in DB), not hardcoded defaults
        await db.delete(categories).where(eq(categories.name, name));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
