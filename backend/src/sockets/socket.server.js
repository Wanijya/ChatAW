const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");

async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    if (!cookies.token) {
      next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    // console.log("user connected:", socket.user);
    // console.log("new client connected:", socket.id);
    socket.on("ai-message", async (messagePayload) => {
      //save the message
      const message = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "user",
      });

      //make the vector and store in pinecone
      const vector = await aiService.generateVector(messagePayload.content);
      // console.log("Vectors genrate :", vector);

      //query memory for relevant context
      const memory = await queryMemory({
        queryVector: vector,
        limit: 3,
        metadata: {
          user: socket.user._id,
        },
      });

      //store the user message vector in pinecone
      await createMemory({
        vector,
        messageId: message._id, //make sure to use unique id generation strategy
        metadata: {
          chatId: messagePayload.chat,
          userId: socket.user._id,
          text: messagePayload.content,
        },
      });

      // console.log("Memory fetched :", memory);

      //get chat history for context and generate AI response
      const chatHistory = (
        await messageModel
          .find({
            chat: messagePayload.chat,
          })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
      ).reverse();

      const stm = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });

      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `
              this are some previous messages from the chat, use them to genrate a response.
              ${memory.map((item) => item.metadata.text).join("\n")}
            `,
            },
          ],
        },
      ];

      console.log(ltm[0]);
      console.log(stm[0]);

      //generate AI response
      const response = await aiService.generateResponse([...ltm, ...stm]);

      //save AI response message
      const responseMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });

      //make the vector and store in pinecone for AI response message
      const responseVectore = await aiService.generateVector(response);
      await createMemory({
        vector: responseVectore,
        messageId: responseMessage._id, //make sure to use unique id generation strategy
        metadata: {
          chatId: messagePayload.chat,
          userId: socket.user._id,
          text: response,
        },
      });

      //emit the AI response back to the client
      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

module.exports = {
  initSocketServer,
};
