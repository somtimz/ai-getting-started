// Major ref: https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone
import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from '@langchain/openai';

import { PineconeStore } from '@langchain/pinecone';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: `.env.local` });

const MAX_TOKENS = 8191;

const fileNames = fs.readdirSync('blogs');

// Helper function to chunk a string into smaller parts
const chunkString = (str, length) => {
  const size = Math.ceil(str.length / length);
  const r = Array(size);
  let offset = 0;

  for (let i = 0; i < size; i++) {
    r[i] = str.substr(offset, length);
    offset += length;
  }

  return r;
};

const docs = [];

fileNames.forEach((fileName) => {
  const filePath = path.join('blogs', fileName);
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const chunks = chunkString(fileContent, MAX_TOKENS);

  chunks.forEach((chunk, index) => {
    docs.push(
      new Document({
        metadata: { fileName, chunkIndex: index },
        pageContent: chunk,
      })
    );
  });
});

console.log('docs = ', docs[0]);

const embeddings = new OpenAIEmbeddings({
  modelName: 'text-embedding-3-large',
});

console.log('embeddings = ', embeddings);
console.log('docs[0] = ', docs[0]);

let client;
client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

client.describeIndex('a16z-ai-getting-started');

console.log('client = ', client);

const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
console.log('pineconeIndex = ', pineconeIndex);

await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
  pineconeIndex,
  maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
});

//await client.indexDocuments(pineconeIndex, lanchainDocs);

//
//
//  lanchainDocs,
//  new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
//  {
//    pineconeIndex,
//  }
//);
