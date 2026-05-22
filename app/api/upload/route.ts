import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Media from '@/lib/models/Media';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    
    const { searchParams } = new URL(req.url);
    const filenameParam = searchParams.get('filename');

    let blob;
    let name;

    if (!filenameParam) {
       // If called from the browser form data
       const formData = await req.formData();
       const file = formData.get('image') as File;
       if (!file) {
         return NextResponse.json({ error: "No file received." }, { status: 400 });
       }
       name = file.name;
       blob = await put(name, file, { access: 'public' });
    } else {
      // Fallback for direct streaming if needed
      if (!req.body) {
        return NextResponse.json({ error: "No body received." }, { status: 400 });
      }
      name = filenameParam;
      blob = await put(name, req.body, { access: 'public' });
    }

    // Save to Database
    const media = await Media.create({
      filename: name,
      url: blob.url,
      size: (blob as any).size || 0,
      contentType: (blob as any).contentType || 'image/auto',
      uploadedBy: session?.user?.id || null
    });

    return NextResponse.json({ ...blob, dbId: media._id });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

