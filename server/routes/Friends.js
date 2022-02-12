const friendController = require("../controllers/Friends");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const friendsRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");
const auth = require("../middlewares/auth");

friendsRoutes.post("/set-request-friend", auth, friendController.setRequest);
friendsRoutes.post("/get-requested-friend", auth, friendController.getRequest);
friendsRoutes.post("/set-accept", auth, friendController.setAccept);
friendsRoutes.post("/set-remove", auth, friendController.setRemoveFriend);
friendsRoutes.post("/list", auth, friendController.listFriends);
friendsRoutes.post("/findFriend", auth, friendController.findFriend);
friendsRoutes.post("/changeStatus", auth, friendController.changeStatus);
friendsRoutes.post("/listFriend", auth, friendController.listFriends2)

module.exports = friendsRoutes;