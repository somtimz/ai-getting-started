import { PineconeClient } from '@pinecone-database/pinecone';

const pineconeClient = new PineconeClient()
await pineconeClient.init({
  apiKey: '5ca3f1d-240b-4b27-841d-8e156bd50490',
  environment: 'us-west-2',
});
const index = pineconeClient.Index('a16z-ai-getting-started');

