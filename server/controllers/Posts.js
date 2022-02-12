const jwt = require("jsonwebtoken");
const fs = require("fs")
const path = require("path");

const UserModel = require("../models/Users");
const PostModel = require("../models/Posts");
const FriendModel = require("../models/Friends");
const DocumentModel = require("../models/Documents");
var url = require('url');
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcrypt");
const {JWT_SECRET} = require("../constants/constants");
const {ROLE_CUSTOMER} = require("../constants/constants");
const uploadFile = require('../functions/uploadFile');

const postsController = {};
const notificationController = require('./Notifications');

// postsController.create = async (req, res, next) => {
//     let userId = req.userId;
//     try {
//         const {
//             described,
//             images,
//             videos,
//         } = req.body;
//         console.log('run');
//         console.log(images);
//         let dataImages = [];
//         if (Array.isArray(images)) {
//             for (const image of images) {
//                 if (uploadFile.matchesFileBase64(image) !== false) {
//                     const imageResult = uploadFile.uploadFile(image);
//                     if (imageResult !== false) {
//                         let imageDocument = new DocumentModel({
//                             fileName: imageResult.fileName,
//                             fileSize: imageResult.fileSize,
//                             type: imageResult.type
//                         });
//                         let savedImageDocument = await imageDocument.save();
//                         if (savedImageDocument !== null) {
//                             dataImages.push(savedImageDocument._id);
//                         }
//                     }
//                 }
//             }
//         }

//         let dataVideos = [];
//         if (Array.isArray(videos)) {
//             for (const video of videos) {
//                 if (uploadFile.matchesFileBase64(video) !== false) {
//                     const videoResult = uploadFile.uploadFile(video);
//                     if (videoResult !== false) {
//                         let videoDocument = new DocumentModel({
//                             fileName: videoResult.fileName,
//                             fileSize: videoResult.fileSize,
//                             type: videoResult.type
//                         });
//                         let savedVideoDocument = await videoDocument.save();
//                         if (savedVideoDocument !== null) {
//                             dataVideos.push(savedVideoDocument._id);
//                         }
//                     }
//                 }
//             }
//         }

//         const post = new PostModel({
//             author: userId,
//             described: described,
//             images: dataImages,
//             videos: dataVideos,
//             countComments: 0
//         });
//         let postSaved = (await post.save()).populate('images').populate('videos');
//         postSaved = await PostModel.findById(postSaved._id).populate('images', ['fileName']).populate('videos', ['fileName']).populate({
//             path: 'author',
//             select: '_id username phonenumber avatar',
//             model: 'Users',
//             populate: {
//                 path: 'avatar',
//                 select: '_id fileName',
//                 model: 'Documents',
//             },
//         });
//         return res.status(httpStatus.OK).json({
//             data: postSaved
//         });
//     } catch (e) {
//         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             message: e.message
//         });
//     }
// }

postsController.create = async (req, res, next) => {

    let userId = req.userId;
    try {
        const described = req.body.described;
        let imageFiles = [];
        let videoFiles = [];
        if (req.files.images) {
            imageFiles = req.files.images;
        }
        if (req.files.videos) {
            videoFiles = req.files.videos;
        }
        let images = [];
        let videos = [];

        imageFiles.forEach((item) => {
            images.push('/uploads/images/' + item.filename);
        })

        videoFiles.forEach((item) => {
            videos.push('/uploads/videos/' + item.filename);
        })
        
        const post = new PostModel({
            author: userId,
            described: described,
            images: images,
            videos: videos,
            countComments: 0
            });
        //
        // await post.save();
        //
        const savePost = await post.save();
        
        let friends = await FriendModel.find({
            status: "1",
        }).or([
            {
                sender: userId
            },
            {
                receiver: userId
            }
        ])
        let listIdFriends = [];
        for (let i = 0; i < friends.length; i++) {
            if (friends[i].sender.toString() === userId.toString()) {
                listIdFriends.push(friends[i].receiver);
            } else {
                listIdFriends.push(friends[i].sender);
            }
        }

        async function addNoti(item, index){ 
            await notificationController.createPostNoti(item, userId, savePost._id, 'đã thêm một kỷ niệm vào nhật ký');
            req.io.sockets.to(item.toString()).emit("notification");
        }

        await Promise.all(listIdFriends.map(addNoti))

        return res.status(httpStatus.OK).json({
            data: post
        });
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: e.message
            });
        }
}

/*
postsController.edit = async (req, res, next) => {
    try {
        let userId = req.userId;
        let postId = req.params.id;
        let postFind = await PostModel.findById(postId);
        if (postFind == null) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find post"});
        }
        if (postFind.author.toString() !== userId) {
            return res.status(httpStatus.FORBIDDEN).json({message: "Can not edit this post"});
        }

        const {
            described,
            images,
            videos,
        } = req.body;
        let dataImages = [];
        if (Array.isArray(images)) {
            for (const image of images) {
                // check is old file
                if (image) {
                    let imageFile = !image.includes('data:') ? await DocumentModel.findById(image) : null;
                    if (imageFile == null) {
                        if (uploadFile.matchesFileBase64(image) !== false) {
                            const imageResult = uploadFile.uploadFile(image);
                            if (imageResult !== false) {
                                let imageDocument = new DocumentModel({
                                    fileName: imageResult.fileName,
                                    fileSize: imageResult.fileSize,
                                    type: imageResult.type
                                });
                                let savedImageDocument = await imageDocument.save();
                                if (savedImageDocument !== null) {
                                    dataImages.push(savedImageDocument._id);
                                }
                            }
                        }
                    } else {
                        dataImages.push(image);
                    }
                }
            }
        }

        let dataVideos = [];
        if (Array.isArray(videos)) {
            for (const video of videos) {
                // check is old file
                if (video) {
                    let videoFile = !video.includes('data:') ? await DocumentModel.findById(video) : null;
                    if (videoFile == null) {
                        if (uploadFile.matchesFileBase64(video) !== false) {
                            const videoResult = uploadFile.uploadFile(video);
                            if (videoResult !== false) {
                                let videoDocument = new DocumentModel({
                                    fileName: videoResult.fileName,
                                    fileSize: videoResult.fileSize,
                                    type: videoResult.type
                                });
                                let savedVideoDocument = await videoDocument.save();
                                if (savedVideoDocument !== null) {
                                    dataVideos.push(savedVideoDocument._id);
                                }
                            }
                        }
                    }
                }
            }
        }


        let postSaved = await PostModel.findByIdAndUpdate(postId, {
            described: described,
            images: dataImages,
            videos: dataVideos,
        });
        postSaved = await PostModel.findById(postSaved._id).populate('images', ['fileName']).populate('videos', ['fileName']).populate({
            path: 'author',
            select: '_id username phonenumber avatar',
            model: 'Users',
            populate: {
                path: 'avatar',
                select: '_id fileName',
                model: 'Documents',
            },
        });
        return res.status(httpStatus.OK).json({
            data: postSaved
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}
*/

postsController.edit = async (req, res, next) => {
    try {
        let userId = req.userId;
        let postId = req.params.id;
        let postFind = await PostModel.findById(postId);
        if (postFind == null) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find post"});
        }
        if (postFind.author.toString() !== userId) {
            return res.status(httpStatus.FORBIDDEN).json({message: "Can not edit this post"});
        }

        let keepImages = []
        let keepVideos = []

        if (req.body.oldImage) {
            if (Array.isArray(req.body.oldImage)) {
                keepImages = req.body.oldImage.map((item) => {
                    let index = item.search('/uploads');
                    let image = item.substring(index);
                    return image;
                })
            }
            else {
                let index = req.body.oldImage.search('/uploads');
                let image = req.body.oldImage.substring(index);
                keepImages = [image];
            }
        }

        if (req.body.oldVideo) {
            let index = req.body.oldVideo.search('/uploads');
            let video = req.body.oldVideo.substring(index);
            keepVideos = [video];
        }

        let deleteImages = postFind.images.filter((item) => !(keepImages.includes(item)));
        let deleteVideos = postFind.videos.filter((item) => !(keepVideos.includes(item)));
        let deleteFiles = [...deleteImages, ...deleteVideos]

        deleteFiles.forEach((item, idx) => {
            fs.unlink(path.join(__dirname, "../" + item), function(err) {
                if (err) {
                  throw err
                } else {
                  console.log("Successfully deleted the file.")
                }
              })
        });

        const described = req.body.described;
        let imageFiles = [];
        let videoFiles = [];
        if (req.files.images) {
            imageFiles = req.files.images;
        }
        if (req.files.videos) {
            videoFiles = req.files.videos;
        }
        let images = [];
        let videos = [];

        imageFiles.forEach((item) => {
            images.push('/uploads/images/' + item.filename);
        })

        videoFiles.forEach((item) => {
            videos.push('/uploads/videos/' + item.filename);
        })

        images = [...keepImages, ...images];
        videos = [...keepVideos, ...videos];

        let postSaved = await PostModel.findByIdAndUpdate(postId, {
            described: described,
            images: images,
            videos: videos,
        });

        postSaved = await PostModel.findById(postSaved._id).populate({
            path: 'author',
            select: '_id username phonenumber avatar',
            model: 'Users'
        });

        return res.status(httpStatus.OK).json({
            data: postSaved
        });

        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: e.message
            });
        }
    }

postsController.show = async (req, res, next) => {
    try {
        let post = await PostModel.findById(req.params.id).populate({
            path: 'author',
            select: '_id username phonenumber avatar',
            model: 'Users'
        });
        if (post == null) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find post"});
        }
        post.isLike = post.like.includes(req.userId);
        return res.status(httpStatus.OK).json({
            data: post,
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
    }
}
postsController.delete = async (req, res, next) => {
    try {
        let post = await PostModel.findByIdAndDelete(req.params.id);
        if (post == null) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find post"});
        }

        let deleteImages = post.images;
        let deleteVideos = post.videos;
        let deleteFiles = [...deleteImages, ...deleteVideos];

        deleteFiles.forEach((item, idx) => {
            fs.unlink(path.join(__dirname, "../" + item), function(err) {
                if (err) {
                  throw err
                } else {
                  console.log("Successfully deleted the file.")
                }
              })
        });


        return res.status(httpStatus.OK).json({
            message: 'Delete post done',
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
    }
}

// postsController.list = async (req, res, next) => {
//     try {
//         let posts = [];
//         let userId = req.userId;
//         if (req.query.userId) {
//             // get Post of one user
//             posts = await PostModel.find({
//                 author: req.query.userId
//             }).populate({
//                 path: 'author',
//                 select: '_id username phonenumber avatar',
//                 model: 'Users'
//             }).sort({"createdAt": -1});
//         } else {
//             // get list friend of 1 user
//             let friends = await FriendModel.find({
//                 status: "1",
//             }).or([
//                 {
//                     sender: userId
//                 },
//                 {
//                     receiver: userId
//                 }
//             ])
//             let listIdFriends = [];
//             for (let i = 0; i < friends.length; i++) {
//                 if (friends[i].sender.toString() === userId.toString()) {
//                     listIdFriends.push(friends[i].receiver);
//                 } else {
//                     listIdFriends.push(friends[i].sender);
//                 }
//             }
//             listIdFriends.push(userId);

//             posts = await PostModel.find({
//                 "author": listIdFriends
//             }).populate({
//                 path: 'author',
//                 select: '_id username phonenumber avatar',
//                 model: 'Users'
//             }).sort({"createdAt": -1});
//         }
//         let postWithIsLike = [];
//         for (let i = 0; i < posts.length; i ++) {
//             let postItem = posts[i];
//             postItem.isLike = postItem.like.includes(req.userId);
//             postWithIsLike.push(postItem);
//         }
//         return res.status(httpStatus.OK).json({
//             data: postWithIsLike
//         });
//     } catch (error) {
//         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
//     }
// }

postsController.list = async (req, res, next) => {
    try {
        let posts = [];
        let userId = req.userId;
        let user = await UserModel.findById(userId);
        if (req.query.userId) {
            // get Post of one user
            posts = await PostModel.find({
                author: req.query.userId
            }).populate({
                path: 'author',
                select: '_id username phonenumber avatar',
                model: 'Users'
            }).sort({"createdAt": -1});
        } else {
            // get list friend of 1 user
            let friends = await FriendModel.find({
                status: "1",
            }).or([
                {
                    sender: userId
                },
                {
                    receiver: userId
                }
            ]).populate('sender').populate('receiver');
            let listIdFriends = [];

            for (let i = 0; i < friends.length; i++) {
                if (friends[i].sender._id.toString() === userId.toString()) {
                    if (!user.blocked_notiDiary.includes(friends[i].receiver._id) && (!friends[i].receiver.blocked_diary.includes(userId))) {
                        listIdFriends.push(friends[i].receiver._id);
                    }
                } else {
                    if (!user.blocked_notiDiary.includes(friends[i].sender._id) && (!friends[i].sender.blocked_diary.includes(userId))) {
                    listIdFriends.push(friends[i].sender._id);
                    }
                }
            }

            listIdFriends.push(userId);

            posts = await PostModel.find({
                "author": listIdFriends
            }).populate({
                path: 'author',
                select: '_id username phonenumber avatar',
                model: 'Users'
            }).sort({"createdAt": -1});
        }
        let postWithIsLike = [];
        for (let i = 0; i < posts.length; i ++) {
            let postItem = posts[i];
            postItem.isLike = postItem.like.includes(req.userId);
            postWithIsLike.push(postItem);
        }
        return res.status(httpStatus.OK).json({
            data: postWithIsLike
        });
    } catch (error) {
        console.log(error)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
    }
}

postsController.listWithContent = async (req, res, next) => {
    try {
        let content = req.body.content;
        let posts = [];
        let userId = req.userId;
        let user = await UserModel.findById(userId);
        if (req.query.userId) {
            // get Post of one user
            posts = await PostModel.find({
                author: req.query.userId
            }).populate({
                path: 'author',
                select: '_id username phonenumber avatar',
                model: 'Users'
            }).sort({"createdAt": -1});
        } else {
            // get list friend of 1 user
            let friends = await FriendModel.find({
                status: "1",
            }).or([
                {
                    sender: userId
                },
                {
                    receiver: userId
                }
            ]).populate('sender').populate('receiver');
            let listIdFriends = [];

            for (let i = 0; i < friends.length; i++) {
                if (friends[i].sender._id.toString() === userId.toString()) {
                    if (!user.blocked_notiDiary.includes(friends[i].receiver._id) && (!friends[i].receiver.blocked_diary.includes(userId))) {
                        listIdFriends.push(friends[i].receiver._id);
                    }
                } else {
                    if (!user.blocked_notiDiary.includes(friends[i].sender._id) && (!friends[i].sender.blocked_diary.includes(userId))) {
                    listIdFriends.push(friends[i].sender._id);
                    }
                }
            }

            listIdFriends.push(userId);

            posts = await PostModel.find({
                "author": listIdFriends,
                "described" : {$regex : content}
            }).populate({
                path: 'author',
                select: '_id username phonenumber avatar',
                model: 'Users'
            }).sort({"createdAt": -1});
        }
        let postWithIsLike = [];
        for (let i = 0; i < posts.length; i ++) {
            let postItem = posts[i];
            postItem.isLike = postItem.like.includes(req.userId);
            postWithIsLike.push(postItem);
        }
        return res.status(httpStatus.OK).json({
            data: postWithIsLike
        });
    } catch (error) {
        console.log(error)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
    }
}

postsController.test = async (req, res, next) => {
    try {
    let userId = req.userId;
    let post = await PostModel.find({author: userId});
    return res.status(httpStatus.OK).json({
        data: post
    });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
    }
}

module.exports = postsController;