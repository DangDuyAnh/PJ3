const httpStatus = require("../utils/httpStatus");
const PostModel = require("../models/Posts");
const notificationController = require('./Notifications');

const postLikeController = {};

postLikeController.action = async (req, res, next) => {
    try {
        let userId = req.userId;
        let isLike = false;
        let post = await PostModel.findById(req.params.postId);
        if (post == null) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find post"});
        }

        let arrLike = post.like;
        let arrLikeNotContainCurrentUser = arrLike.filter((item) => {
            return item != userId
        });
        if (arrLikeNotContainCurrentUser.length === arrLike.length) {
            arrLike.push(userId);
            isLike = true;
            if (post.author.toString() !== userId.toString()) {
                await notificationController.createPostNoti(post.author, userId, post._id, 'vừa thả tim bài viết của bạn');
                req.io.sockets.to(post.author.toString()).emit("notification");
            }
            } else {
            arrLike = arrLikeNotContainCurrentUser;
        }
        post = await PostModel.findOneAndUpdate({_id: req.params.postId}, {
            like: arrLike
        }, {
            new: true,
            runValidators: true
        }).populate('like', ['username', 'phonenumber']);

        if (!post) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find post"});
        }
        post.isLike = isLike;
        return res.status(httpStatus.OK).json({
            data: post
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
    }
}

module.exports = postLikeController;