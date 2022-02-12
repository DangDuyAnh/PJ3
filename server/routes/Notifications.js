const notificationController = require('../controllers/Notifications');
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const notificationRoutes = express.Router();
const auth = require("../middlewares/auth");
const admin = require("firebase-admin");
const serviceAccount = require("../firebase.json");

notificationRoutes.get(
    "/list",
    auth,
    asyncWrapper(notificationController.list)
)

notificationRoutes.get(
    "/change-status/:notiId",
    auth,
    asyncWrapper(notificationController.changeStatus)
)

notificationRoutes.post(
    "/register-token",
    auth,
    asyncWrapper(notificationController.registerToken)
)

notificationRoutes.post(
    "/destroy-token",
    auth,
    asyncWrapper(notificationController.destroyToken)
)

/*
notificationRoutes.route('/test').get(async (req, res) => {
    console.log('come here')
    try {
        // req.io.sockets.to('12345').emit("test");
        // req.io.sockets.emit("test");
        const tokens = ['clYDWC6PQZqZSzW1_cb76u:APA91bG2lH8h39lmQHW1I0ZZjxI8nkV7KcV5b1YEZvyul3Ym8J_3kEGX2gpf_meMX2Ym6VaTVEeB5Js5PivixGfk-Z8OiidOIQYDPSV-8Nrj3elcUhnG5bwWnRJ1dptBaPIOK-zOGINX']
        await admin.messaging().sendMulticast({
            tokens: tokens,
            notification: {
              body: 'test2'
            },
            data: {
                type: 'test',
                postId: 'test'
            }
          });
        res.json('nothing')
    } catch (e) {
        console.log(e.message)
    }
});
*/

module.exports = notificationRoutes;