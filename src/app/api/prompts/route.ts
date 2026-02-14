import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const promptsDir = path.join(process.cwd(), 'prompts');
    
    if (!fs.existsSync(promptsDir)) {
      // Try to read default.md from project root if prompts dir doesn't exist
      const defaultPath = path.join(process.cwd(), 'prompts', 'default.md');
      try {
        const content = fs.readFileSync(defaultPath, 'utf-8');
        const titleMatch = content.match(/^#\s+(.+)$/m);
        return NextResponse.json({ prompts: [
          {
            id: 'default',
            title: titleMatch ? titleMatch[1] : 'Default Assistant',
            filename: 'default.md',
            content: content,
          }
        ]});
      } catch {
        // Fallback if file read fails
        return NextResponse.json({ prompts: [
          {
            id: 'default',
            title: 'Default Assistant',
            filename: 'default.md',
            content: 'You are a helpful voice assistant. Respond concisely and naturally.',
          }
        ]});
      }
    }

    const files = fs.readdirSync(promptsDir);
    
    const prompts = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(promptsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
        
        return {
          id: file.replace('.md', ''),
          title: title,
          filename: file,
          content: content,
        };
      });

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Error reading prompts:', error);
    return NextResponse.json(
      { error: 'Failed to load prompts' },
      { status: 500 }
    );
  }
}