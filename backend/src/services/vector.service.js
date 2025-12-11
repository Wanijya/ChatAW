const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const chatAwIndex = pc.Index("chat-aw");

async function createMemory({ vector, metadata, messageId }) {
  await chatAwIndex.upsert([
    {
      id: messageId,
      values: vector,
      metadata,
    },
  ]);
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  const data = await chatAwIndex.query({
    vector: queryVector,
    topK: limit,
    filter: metadata ? { metadata } : undefined,
    includeMetadata: true,
  });
  return data.matches;
}

module.exports = {
  createMemory,
  queryMemory,
};
