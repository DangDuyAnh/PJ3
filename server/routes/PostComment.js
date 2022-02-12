const postCommentController = require("../controllers/PostComment");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const postCommentRoutes = express.Router();
const auth = require("../middlewares/auth");
const PostComment = require("../models/PostComment");

postCommentRoutes.post(
    "/create/:postId",
    auth,
    asyncWrapper(postCommentController.create),
);

postCommentRoutes.get(
    "/delete/:id",
    asyncWrapper(postCommentController.delete)
);

postCommentRoutes.post(
    "/update/:id",
    asyncWrapper(postCommentController.update)
);

postCommentRoutes.get(
    "/list/:postId",
    auth,
    asyncWrapper(postCommentController.list),
);
module.exports = postCommentRoutes;