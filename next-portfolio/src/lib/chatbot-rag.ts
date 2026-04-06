import { promises as fs } from "fs";
import path from "path";

const knowledgeRoot = path.join(process.cwd(), "src", "content", "chatbot");

type Chunk = {
  source: string;
  text: string;
};

export type RetrievalResult = {
  context: string;
  hasRelevantMatch: boolean;
  topScore: number;
  sources: string[];
};

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function scoreChunk(chunk: Chunk, query: string) {
  const normalizedQuery = normalizeText(query);
  const normalizedChunk = normalizeText(chunk.text);
  const queryTerms = normalizedQuery.split(/\s+/).filter((term) => term.length > 2);

  if (queryTerms.length === 0) {
    return 0;
  }

  let score = 0;

  for (const term of queryTerms) {
    if (normalizedChunk.includes(term)) {
      score += 3;
    }

    if (normalizeText(chunk.source).includes(term)) {
      score += 1;
    }
  }

  return score;
}

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return collectMarkdownFiles(fullPath);
      }

      return entry.name.endsWith(".md") ? [fullPath] : [];
    }),
  );

  return files.flat();
}

function splitIntoChunks(source: string, content: string): Chunk[] {
  const compact = content
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return compact.map((text) => ({ source, text }));
}

export async function retrieveKnowledge(query: string): Promise<RetrievalResult> {
  try {
    const markdownFiles = await collectMarkdownFiles(knowledgeRoot);
    const chunks = await Promise.all(
      markdownFiles.map(async (filePath) => {
        const content = await fs.readFile(filePath, "utf8");
        return splitIntoChunks(path.basename(filePath), content);
      }),
    );

    const ranked = chunks
      .flat()
      .map((chunk) => ({
        ...chunk,
        score: scoreChunk(chunk, query),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .filter((chunk) => chunk.score > 0);

    const selectedChunks = ranked.length > 0 ? ranked : chunks.flat().slice(0, 4);
    const uniqueSources = [...new Set(selectedChunks.map((chunk) => chunk.source))];

    return {
      context: selectedChunks
        .map((chunk) => `Source: ${chunk.source}\n${chunk.text}`)
        .join("\n\n---\n\n"),
      hasRelevantMatch: ranked.length > 0,
      topScore: ranked[0]?.score ?? 0,
      sources: uniqueSources,
    };
  } catch {
    return {
      context: "",
      hasRelevantMatch: false,
      topScore: 0,
      sources: [],
    };
  }
}
