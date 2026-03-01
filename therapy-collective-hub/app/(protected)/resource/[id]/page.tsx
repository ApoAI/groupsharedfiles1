import { db } from '@/db';
import { resources, comments, folders } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import ResourceDetailClient from './ResourceDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ResourceDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const resource = await db.query.resources.findFirst({
    where: eq(resources.id, id),
    with: {
      folder: true,
      comments: {
        orderBy: [desc(comments.createdAt)],
      },
    },
  });

  if (!resource) {
    notFound();
  }

  return <ResourceDetailClient initialResource={resource} />;
}
