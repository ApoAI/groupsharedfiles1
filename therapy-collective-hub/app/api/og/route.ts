import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TherapyCollectiveBot/1.0)',
      },
    });

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const getMetaContent = (name: string, property: string) => {
      const meta = doc.querySelector(`meta[name="${name}"], meta[property="${property}"]`);
      return meta ? meta.getAttribute('content') : null;
    };

    const title = getMetaContent('title', 'og:title') || doc.title;
    const description = getMetaContent('description', 'og:description');
    const image = getMetaContent('', 'og:image') || getMetaContent('twitter:image', 'twitter:image');

    return NextResponse.json({ title, description, image });
  } catch (error) {
    console.error('Error fetching OG data:', error);
    return NextResponse.json({ error: 'Failed to fetch OG data' }, { status: 500 });
  }
}
