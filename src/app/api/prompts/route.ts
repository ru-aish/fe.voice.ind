import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DEFAULT_PROMPT = {
  id: 'default',
  title: 'Default Assistant',
  filename: 'default.md',
  content: 'You are a helpful voice assistant. Respond concisely and naturally.',
};

export async function GET() {
  try {
    const promptsDir = path.join(process.cwd(), 'prompts');

    const files = await fs.readdir(promptsDir).catch(() => []);
    const mdFiles = files.filter((file) => file.endsWith('.md'));

    if (mdFiles.length === 0) {
      return NextResponse.json({
        prompts: [DEFAULT_PROMPT],
      });
    }

    const results = await Promise.allSettled(
      mdFiles.map(async (file) => {
        const filePath = path.join(promptsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const titleMatch = content.match(/^#\s+(.+)$/m);

        return {
          id: file.replace('.md', ''),
          title: titleMatch ? titleMatch[1] : file.replace('.md', ''),
          filename: file,
          content,
        };
      })
    );

    const prompts = results
      .filter((result): result is PromiseFulfilledResult<{ id: string; title: string; filename: string; content: string }> => result.status === 'fulfilled')
      .map(result => result.value);

    const errors = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map(result => result.reason);

    if (errors.length > 0) {
      console.warn('Failed to read some prompt files:', errors);
    }

    if (prompts.length === 0 && errors.length > 0) {
      return NextResponse.json({
        prompts: [DEFAULT_PROMPT],
      });
    }

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Error reading prompts:', error);
    return NextResponse.json(
      { error: 'Failed to load prompts' },
      { status: 500 }
    );
  }
}
