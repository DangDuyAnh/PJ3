const NotificationModel = require("../models/Notifications");
const FcmTokenModel = require("../models/FcmTokens");
const UserModel = require("../models/Users");
const httpStatus = require("../utils/httpStatus");
const notificationController = {};
const admin = require("firebase-admin");
const serviceAccount = require("../firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

notificationController.createPostNoti = async (notiUserId, activeUserId, postId, description) => {
    try{
        const notification = new NotificationModel({
            notiUserId: notiUserId,
            activeUserId: activeUserId,
            postId: postId,
            description: description
        })
        await notification.save();

        let fcmToken = await FcmTokenModel.findOne({userId: notiUserId});
        let user = await UserModel.findById(activeUserId);
        let tokens = fcmToken.tokens;

        await admin.messaging().sendMulticast({
            tokens,
            notification: {
              body: `${user.username} ${description}`
            },
            data: {
                type: 'post',
                postId: postId.toString()
            }
          });
    
        return 1;
    } catch(e) {
        return(e.message)
    }
};

notificationController.list = async (req, res, next) => {
    try {
        let userId = req.userId;
        let notiList = await NotificationModel.find({
            notiUserId: userId
        }).populate({
            path: 'activeUserId',
            select: '_id username avatar',
            model: 'Users'
        }).sort({"createdAt": -1});
        
        return res.status(httpStatus.OK).json({
            data: notiList
        });
        
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}

notificationController.changeStatus = async (req, res, next) => {
    try {
        let notiId = req.params.notiId;
        let noti = await NotificationModel.findOne({_id: notiId});
        if (!noti) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find notification"});
        }
        let status = noti.status;

        //change status value
        if (status === 0) status = 1;
        else status = 0;

        let updateNoti = await NotificationModel.findOneAndUpdate({_id: notiId}, {
            status: status
        }, {
            new: true,
            runValidators: true
        })
        return res.status(httpStatus.OK).json({
            data: updateNoti
        });
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        })
    }
}

notificationController.registerToken = async (req, res, next) => {
    try {
        let userId = req.userId;
        let token = req.body.token
        let fcmToken = await FcmTokenModel.findOne({userId: userId});
        let savedToken;

        //user đã có trong db
        if (fcmToken) {
            let tokens = fcmToken.tokens;
            //chỉ lưu token khi nó chưa tồn tại
            if (!tokens.includes(token)) {
                tokens.push(token);
                savedToken = await FcmTokenModel.findOneAndUpdate({userId: userId}, {
                    tokens: tokens
                }, {
                    new: true,
                    runValidators: true
                });
            }
        }
        //user chưa có trong db
        else {
            let tokens = [];
            tokens.push(token);
            savedToken = new FcmTokenModel({
                userId: userId,
                tokens: tokens
            });
            await savedToken.save();
        }

        return res.status(httpStatus.OK).json({
            fcmToken: savedToken
        });
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        })
    }
}

notificationController.destroyToken = async (req, res, next) => {
    try {
        let userId = req.userId;
        let token = req.body.token;
        let fcmToken = await FcmTokenModel.findOne({userId: userId});
        let savedToken;

        if (fcmToken) {
            let tokens = fcmToken.tokens;
            let newTokens = tokens.filter(item => item !== token);

            savedToken = await FcmTokenModel.findOneAndUpdate({userId: userId}, {
                tokens: newTokens
            }, {
                new: true,
                runValidators: true
            });  
        }
        
        return res.status(httpStatus.OK).json({
            fcmToken: savedToken
        });
    } catch (e) {
        console.log(e.message)
    }
}

module.exports = notificationController;
