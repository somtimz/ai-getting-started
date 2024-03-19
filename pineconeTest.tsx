import { PineconeClient } from '@pinecone-database/pinecone';

const pineconeClient = new PineconeClient()
await pineconeClient.init({
  apiKey: 'xxx',
  environment: 'us-west-2',
});
const index = pineconeClient.Index('a16z-ai-getting-started');

