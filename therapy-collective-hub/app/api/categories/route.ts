import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories, resources } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { CATEGORIES } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const dbCategories = await db.select().from(categories).orderBy(asc(categories.name));
        const dbNames = dbCategories.map(c => c.name);

        if (!dbNames.includes('__MIGRATED__')) {
            // Unmigrated state: Insert missing defaults
            const missingDefaults = CATEGORIES.filter(c => !dbNames.includes(c));
            if (missingDefaults.length > 0) {
                await db.insert(categories).values(missingDefaults.map(name => ({ name }))).onConflictDoNothing();
            }
            // Insert the flag
            await db.insert(categories).values({ name: '__MIGRATED__' }).onConflictDoNothing();

            const finalCategories = await db.select().from(categories).orderBy(asc(categories.name));
            return NextResponse.json(finalCategories.filter(c => c.name !== '__MIGRATED__').map(c => c.name));
        }

        return NextResponse.json(dbNames.filter(name => name !== '__MIGRATED__'));
    } catch (error) {
        console.error('Error fetching categories:', error);
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
        await db.delete(categories).where(eq(categories.name, name));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { oldName, newName } = await request.json();
        if (!oldName?.trim() || !newName?.trim()) {
            return NextResponse.json({ error: 'Both old and new names required' }, { status: 400 });
        }

        // Update category in categories table (if it exists there)
        await db.update(categories)
            .set({ name: newName.trim() })
            .where(eq(categories.name, oldName.trim()));

        // Update all resources that reference the old category name
        await db.update(resources)
            .set({ category: newName.trim() })
            .where(eq(resources.category, oldName.trim()));

        return NextResponse.json({ success: true, name: newName.trim() });
    } catch (error) {
        console.error('Error renaming category:', error);
        return NextResponse.json({ error: 'Failed to rename category' }, { status: 500 });
    }
}
