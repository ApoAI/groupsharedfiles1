import { db } from '@/db';
import { resources, folders } from '@/db/schema';
import { desc } from 'drizzle-orm';
import LibraryClient from './LibraryClient';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const allResources = await db.query.resources.findMany({
    with: {
      folder: true,
      comments: true,
    },
    orderBy: [desc(resources.addedAt)],
  });

  const allFolders = await db.query.folders.findMany({
    orderBy: [desc(folders.createdAt)],
  });

  return <LibraryClient initialResources={allResources} folders={allFolders} />;
}
