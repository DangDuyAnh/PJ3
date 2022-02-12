const chatController = require("../controllers/Chats");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const chatsRoutes = express.Router();
const auth = require("../middlewares/auth");
const uploadFiles = require("../middlewares/uploadFiles");

chatsRoutes.post(
    "/send",
    auth,
    uploadFiles,
    asyncWrapper(chatController.send),
);

chatsRoutes.get(
    "/getMessages/:chatId",
    auth,
    asyncWrapper(chatController.getMessages),
);

chatsRoutes.get(
    "/getListConversations",
    auth,
    asyncWrapper(chatController.getListConversations),
);

chatsRoutes.get(
    "/deleteMessage/:messageId",
    auth,
    asyncWrapper(chatController.deleteMessage),
);

chatsRoutes.get(
    "/deleteConversation/:chatId",
    auth,
    asyncWrapper(chatController.deleteConversation),
);

chatsRoutes.get(
    "/getUserStatus/:userId",
    asyncWrapper(chatController.getStatus)
);

chatsRoutes.post(
    "/createChat",
    asyncWrapper(chatController.createChat),
);

module.exports = chatsRoutes;