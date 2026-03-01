import { db } from '@/db';
import { folders } from '@/db/schema';
import { desc } from 'drizzle-orm';
import FoldersClient from './FoldersClient';

export const dynamic = 'force-dynamic';

export default async function FoldersPage() {
    const allFolders = await db.query.folders.findMany({
        with: { resources: true },
        orderBy: [desc(folders.createdAt)],
    });

    return <FoldersClient initialFolders={allFolders} />;
}
