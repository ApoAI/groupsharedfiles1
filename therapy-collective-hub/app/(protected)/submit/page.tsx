import { db } from '@/db';
import { folders } from '@/db/schema';
import { desc } from 'drizzle-orm';
import SubmitClient from './SubmitClient';

export const dynamic = 'force-dynamic';

export default async function SubmitPage() {
  const allFolders = await db.query.folders.findMany({
    orderBy: [desc(folders.createdAt)],
  });

  return <SubmitClient folders={allFolders} />;
}
