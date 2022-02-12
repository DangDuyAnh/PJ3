const {
    PRIVATE_CHAT,
    GROUP_CHAT,
} = require('../constants/constants');
const ChatModel = require("../models/Chats");
const MessagesModel = require("../models/Messages");
const UserModel = require("../models/Users");
const httpStatus = require("../utils/httpStatus");
const UserStatusModel = require("../models/UserStatus")
const chatController = {};
// chatController.send = async (req, res, next) => {
//     try {
//         let userId = req.userId;
//         const {
//             name,
//             chatId,
//             receivedId,
//             member,
//             type,
//             content
//         } = req.body;
//         let chatIdSend = null;
//         let chat;
//         if (type === PRIVATE_CHAT) {
//             if (chatId) {
//                 chat = await ChatModel.findById(chatId);
//                 if (chat !== null) {
//                     chatIdSend = chat._id;
//                 }
//             } else {
//                 chat = new ChatModel({
//                    type: PRIVATE_CHAT,
//                    member: [
//                        receivedId,
//                        userId
//                    ]
//                 });
//                 await chat.save();
//                 chatIdSend = chat._id;
//             }
//         } else if (type === GROUP_CHAT) {
//             if (chatId) {
//                 chat = await ChatModel.findById(chatId);
//                 if (chat !== null) {
//                     chatIdSend = chat._id;
//                 }
//             } else {
//                 chat = new ChatModel({
//                     type: GROUP_CHAT,
//                     member: member
//                 });
//                 await chat.save();
//                 chatIdSend = chat._id;
//             }
//         }
//         if (chatIdSend) {
//             if (content) {
//                 let message = new MessagesModel({
//                     chat: chatIdSend,
//                     user: userId,
//                     content: content
//                 });
//                 await message.save();
//                 let messageNew = await MessagesModel.findById(message._id).populate('chat').populate('user');
//                 return res.status(httpStatus.OK).json({
//                     data: messageNew
//                 });
//             } else {
//                 return res.status(httpStatus.OK).json({
//                     data: chat,
//                     message: 'Create chat success',
//                     response: 'CREATE_CHAT_SUCCESS'
//                 });
//             }
//         } else {
//             return res.status(httpStatus.BAD_REQUEST).json({
//                 message: 'Not chat'
//             });
//         }

//     } catch (e) {
//         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             message: e.message
//         });
//     }
// }

chatController.send = async (req, res, next) => {
    try {
        const userId = req.userId;
        const {
            chatId,
            receivedId,
            member,
            type,
            content
        } = req.body;
        let chatIdSend = null;
        let chat;
        if (type === PRIVATE_CHAT) {
            if (chatId) {
                chat = await ChatModel.findById(chatId);
                if (chat !== null) {
                    chatIdSend = chat._id;
                }
            } else {
                chat = new ChatModel({
                    type: PRIVATE_CHAT,
                    member: [
                       receivedId,
                       userId
                    ]
                });
                await chat.save();
                chatIdSend = chat._id;
            }
        } 

        else if (type === GROUP_CHAT) {
            if (chatId) {
                chat = await ChatModel.findById(chatId);
                if (chat !== null) {
                    chatIdSend = chat._id;
                }
            } else {
                chat = new ChatModel({
                    type: GROUP_CHAT,
                    member: member
                });
                await chat.save();
                chatIdSend = chat._id;
            }
        }

        if (chatIdSend) {
            let image = null;
            let video = null;

        if (req.files) {
            if (req.files.images) {
                image = '/uploads/images/' + req.files.images[0].filename;
            }
            if (req.files.videos) {
                video = '/uploads/videos/' + req.files.videos[0].filename;
            }
        }
            let message = new MessagesModel({
                chat: chatIdSend,
                user: userId,
                content: content,
                image: image,
                video: video
            });
            await message.save();
            let messageNew = await MessagesModel.findById(message._id).populate('chat').populate('user');
            req.io.sockets.to(chatIdSend.toString()).emit("chat");
            return res.status(httpStatus.OK).json({
                data: messageNew
            });

        } else {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Not chat'
            });
        }

    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}

chatController.createChat = async (req, res, next) => {
    try {
        const {
            user1,
            user2
        } = req.body
        let chatModel = await ChatModel.findOne({ member: { $all: [user1, user2] } });
        if (!chatModel) {
            let chat = new ChatModel({
                type: PRIVATE_CHAT,
                member: [
                user1,
                user2
                ]
            });
            await chat.save();
            return res.status(httpStatus.OK).json({
                chat: chat
            });
        }
        return res.status(httpStatus.OK).json({
            chat: chatModel
        });
    } catch (e) {
        console.log(e);
    }
}

chatController.getMessages = async (req, res, next) => {
    try {
        let messages = await MessagesModel.find({
            chat: req.params.chatId
        }, {}, { sort: {'createdAt': -1 } }).populate('user');
        return res.status(httpStatus.OK).json({
            data: messages
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}
chatController.getListConversations = async (req, res, next) => {
    try {
        let userId = req.userId; //"617f0af2549fef460c878c6e"
        let array = await ChatModel.find();
        let chats = array.filter(element => {
            return element.member.includes(userId)
        });

        let lastMessages = new Map();
        let receivers = new Map();
        async function getLastMessages(chat) {
            let lastMessage = await MessagesModel.findOne({chat: chat._id}, {}, { sort: {'createdAt': -1 } });
            lastMessages.set(chat._id, lastMessage);
            let id;
            chat.member.forEach(element => {
                if (element != userId) id = element;
            });
            let receiver = await UserModel.findById(id);
            receivers.set(chat._id, receiver);
        }; 
        await Promise.all(chats.map(getLastMessages));
        let returnArray = [];
        chats.forEach((chat, idx) => {
            if (lastMessages.get(chat._id)) {
                returnArray.push({chat: chat, lastMessage: lastMessages.get(chat._id), sender: userId, receiver: receivers.get(chat._id)})
            }
        });

        returnArray.sort(function(a,b){
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
          });

        // chats.forEach((chat, idx) => {
        //     returnArray.push({chat: chat, lastMessage: lastMessages.get(chat._id), sender: userId, receiver: receivers.get(chat._id)})
        // });

        // const sortedReturnArray = returnArray.sort((item1, item2) => new Date(item1.lastMessage.createdAt) - new Date(item2.lastMessage.createdAt));
        // console.log(sortedReturnArray[0].receiver.username);
        // console.log(sortedReturnArray)
        return res.status(httpStatus.OK).json({
            data: returnArray
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}
chatController.deleteMessage = async (req, res, next) => {
    try {
        let message = await MessagesModel.findByIdAndDelete(req.params.messageId);
        if (message == null) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find post"});
        }
        return res.status(httpStatus.OK).json({
            message: 'Delete message done',
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}
chatController.deleteConversation = async (req, res, next) => {
    try {
        let chat = await ChatModel.findByIdAndDelete(req.params.chatId);
        if (chat == null) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find conversation"});
        }
        let messages = await MessagesModel.deleteMany({
            chat: req.params.chatId
        })
        return res.status(httpStatus.OK).json({
            message: 'Delete conversation done',
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}

chatController.getStatus = async (req, res, next) => {
    try {
        let statusUser = await UserStatusModel.findOne({
            userId: req.params.userId
        })
        return res.status(httpStatus.OK).json({
            statusUser: statusUser
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}

chatController.getListConversation = async (req, res, next) => {

    try {
        let userId = req.userId;
        let conversation = await ChatModel.find({ member: userId });

        let lastMessages = [];
        lastMessages.push('2');
        let lastMessage;
        async function getLastMessages(item, index){ 
            lastMessage = await MessagesModel.findOne({chat: item._id},{}, { sort: { 'createdAt' : -1 } });
            console.log(lastMessage)
            lastMessages.push(lastMessage);
        }
        await Promise.all(conversation.map(getLastMessages));

        let returnArray = [];
        conversation.forEach((item, idx) => {
            returnArray.push({conversation: conversation[idx], lastMessage: lastMessages[idx]})
        });

        return res.status(httpStatus.OK).json({
            data: returnArray,
        });

    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}

chatController.saveUserStatus = async (userId) => {
    try {
    let UserStatus = await UserStatusModel.findOne({ userId: userId });
    let saveUserStatus;
    if (UserStatus) {
        saveUserStatus = await UserStatusModel.findOneAndUpdate({userId: userId}, {
            status: 'ONLINE'
        }, {
            new: true,
            runValidators: true
        }); 
    }
    else {
        saveUserStatus = new UserStatusModel({
            userId: userId,
            status: 'ONLINE'
        });
        await saveUserStatus.save();
    }
        console.log(saveUserStatus)
    } catch (e) {
        console.log(e);
    }
}

chatController.clearUserStatus = async (userId) => {
    try {
        let UserStatus = await UserStatusModel.findOne({userId: userId});
        let savedUserStatus;

        if (UserStatus) {
            savedUserStatus = await UserStatusModel.findOneAndUpdate({userId: userId}, {
                status: 'OFFLINE',
                lastSeen: new Date(),
            }, {
                new: true,
                runValidators: true
            }); 
            console.log(savedUserStatus); 
        }
    } catch(e) {
        console.log(e);
    }
}

module.exports = chatController;