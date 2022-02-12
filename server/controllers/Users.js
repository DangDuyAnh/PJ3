const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
const DocumentModel = require("../models/Documents");
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcrypt");
const {JWT_SECRET} = require("../constants/constants");
const uploadFile = require('../functions/uploadFile');
const {GENDER_FEMALE} = require("../constants/constants");
const usersController = {};

usersController.findNumber = async (req, res, next) => {
    const {phonenumber} = req.body;
    let user = await UserModel.findOne({
        phonenumber: phonenumber
    })
    res.json({data:user});   
    }

usersController.register = async (req, res, next) => {
    try {
        const {
            phonenumber,
            password,
            username,
            birthday,
            gender
        } = req.body;

        let user = await UserModel.findOne({
            phonenumber: phonenumber
        })

        let avatar = "/uploads/images/DefaultMale.jpg";
        let cover_image = "/uploads/images/DefaultCover.jpg";
        if (gender === GENDER_FEMALE) {
            avatar = "/uploads/images/DefalutFemale.jpg"
        }

        if (user) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Phone number already exists'
            });
        }
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new UserModel({
            phonenumber: phonenumber,
            password: hashedPassword,
            username: username,
            birthday: birthday,
            gender: gender,
            avatar: avatar,
            cover_image: cover_image
        });

        try {
            const savedUser = await user.save();

            // login for User
            // create and assign a token
            const token = jwt.sign(
                {username: savedUser.username, phonenumber: savedUser.phonenumber, id: savedUser._id},
                JWT_SECRET
            );
            res.status(httpStatus.CREATED).json({
                user: user,
                token: token
            })
        } catch (e) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: e.message
            });
        }
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}
usersController.login = async (req, res, next) => {
    try {
        const {
            phonenumber,
            password
        } = req.body;
        const user = await UserModel.findOne({
            phonenumber: phonenumber
        })
        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Username or password incorrect'
            });
        }

        // password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Username or password incorrect'
            });
        }

        // login success

        // create and assign a token
        const token = jwt.sign(
            {username: user.username, firstName: user.firstName, lastName: user.lastName, id: user._id},
            JWT_SECRET
        );
        delete user["password"];
        return res.status(httpStatus.OK).json({
            user: user,
            token: token
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}
usersController.edit = async (req, res, next) => {
    try {
        let userId = req.userId;
        let user;
        const dataUserUpdate = {};
        const listPros = [
            "username",
            "gender",
            "birthday",
        ];
        for (let i = 0; i < listPros.length; i++) {
            let pro = listPros[i];
            if (req.body[pro]) {
                dataUserUpdate[pro] = req.body[pro];
            }
        }

        if (req.files) {
            if (req.files.images) {
                let image = '/uploads/images/' + req.files.images[0].filename;
                if (req.body.changeImage === 'avatar') {
                    dataUserUpdate['avatar'] = image
                } 
                else if (req.body.changeImage === 'cover_image') {
                    dataUserUpdate['cover_image'] = image;
                }
            }
        }


        user = await UserModel.findOneAndUpdate({_id: userId}, dataUserUpdate, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find user"});
        }
        user = await UserModel.findById(userId);
        return res.status(httpStatus.OK).json({
            data: user
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}

usersController.changePassword = async (req, res, next) => {
    try {
        let userId = req.userId;
        let  user = await UserModel.findById(userId);
        if (user == null) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "UNAUTHORIZED"
            });
        }
        const {
            currentPassword,
            newPassword,
        } = req.body;
        // password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Current password incorrect',
                code: 'CURRENT_PASSWORD_INCORRECT'
            });
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        user = await UserModel.findOneAndUpdate({_id: userId}, {
            password: hashedNewPassword
        }, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find user"});
        }

        // create and assign a token
        const token = jwt.sign(
            {username: user.username, firstName: user.firstName, lastName: user.lastName, id: user._id},
            JWT_SECRET
        );
        user = await UserModel.findById(userId).select('phonenumber username gender birthday avatar cover_image blocked_inbox blocked_diary').populate('avatar').populate('cover_image');
        return res.status(httpStatus.OK).json({
            data: user,
            token: token
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message,
        });
    }
}
usersController.show = async (req, res, next) => {
    try {
        let userId = req.params.id;
        let user = await UserModel.findById(userId);
        if (user == null) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find user"});
        }
        return res.status(httpStatus.OK).json({
            data: user
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
    }
}

usersController.showWithBlockFriend = async (req, res, next) => {
    try {
        let userId = req.userId;
        let user = await UserModel.findById(userId).populate({
            path: 'blocked_inbox',
            select: '_id username phonenumber avatar',
            model: 'Users'
        }).populate({
            path: 'blocked_diary',
            select: '_id username phonenumber avatar',
            model: 'Users'
        }).populate({
            path: 'blocked_inbox',
            select: '_id username phonenumber avatar',
            model: 'Users'
        }).populate({
            path: 'blocked_notiDiary',
            select: '_id username phonenumber avatar',
            model: 'Users'
        })
        if (user == null) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find user"});
        }
        return res.status(httpStatus.OK).json({
            data: user
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
    }
}

usersController.setBlock = async (req, res, next) => {
    try {
        let targetId = req.body.user_id;
        let type = req.body.type;
        let user = await UserModel.findById(req.userId);
        blocked = []
        if (user.hasOwnProperty('blocked')) {
            blocked = user.blocked_inbox
        }
    
        if(type) {
     
            if(blocked.indexOf(targetId) === -1) {
                blocked.push(targetId);
            }
        } else {
            const index = blocked.indexOf(targetId);
            if (index > -1) {
                blocked.splice(index, 1);
            }
        }

        user.blocked_inbox = blocked;
        user.save();

        res.status(200).json({
            code: 200,
            message: "Thao tác thành công",
            data: user
        });

    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}

usersController.editBlock = async (req, res, next) => {
    try {
        let userId = req.userId;
        const {
            blockId,
            blockField
        } = req.body;
        let user = await UserModel.findById(req.userId);
        let blocked = user[blockField];
        if(blocked.indexOf(blockId) === -1) {
            blocked.push(blockId);
        } else {
            const index = blocked.indexOf(blockId);
            if (index > -1) {
                blocked.splice(index, 1);
            }
        }
        user[blockField] = blocked;
        user.save();

        res.status(200).json({
            code: 200,
            message: "Thao tác thành công",
            data: user
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}
usersController.setBlockDiary = async (req, res, next) => {
    try {
        let targetId = req.body.user_id;
        let type = req.body.type;
        let user = await UserModel.findById(req.userId);
        blocked = []
        if (user.hasOwnProperty('blocked')) {
            blocked = user.blocked_diary
        }
    
        if(type) {
     
            if(blocked.indexOf(targetId) === -1) {
                blocked.push(targetId);
            }
        } else {
            const index = blocked.indexOf(targetId);
            if (index > -1) {
                blocked.splice(index, 1);
            }
        }

        user.blocked_diary = blocked;
        user.save();

        res.status(200).json({
            code: 200,
            message: "Thao tác thành công",
            data: user
        });

    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}
usersController.searchUser = async (req, res, next) => {
    try {
        let searchKey = new RegExp(req.body.keyword, 'i')
        let result = await UserModel.find({ $or:[{phonenumber: searchKey},{username: searchKey}] }).limit(10);//.populate('avatar').populate('cover_image').exec();

        res.status(200).json({
            code: 200,
            message: "Tìm kiếm thành công",
            data: result
        });

    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}

module.exports = usersController;