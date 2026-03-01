import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Add unique suffix to prevent name conflicts
    const ext = file.name.lastIndexOf('.') >= 0 ? file.name.slice(file.name.lastIndexOf('.')) : '';
    const baseName = file.name.lastIndexOf('.') >= 0 ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name;
    const uniqueName = `${baseName}-${Date.now()}${ext}`;

    const blob = await put(uniqueName, file, { access: 'private' });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
