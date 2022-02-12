const postsController = require("../controllers/Posts");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const postsRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const uploadFiles = require("../middlewares/uploadFiles");

postsRoutes.post(
    "/create",
    auth,
    uploadFiles,
    asyncWrapper(postsController.create)
);

postsRoutes.get(
    "/testListPost",
    auth,
    asyncWrapper(postsController.test)
);

postsRoutes.post(
    "/edit/:id",
    auth,
    uploadFiles,
    asyncWrapper(postsController.edit)
);

postsRoutes.get(
    "/show/:id",
    auth,
    asyncWrapper(postsController.show),
);

postsRoutes.get(
    "/delete/:id",
    auth,
    asyncWrapper(postsController.delete),
);

postsRoutes.get(
    "/list",
    auth,
    asyncWrapper(postsController.list),
);

postsRoutes.post(
    "/listWithContent",
    auth,
    asyncWrapper(postsController.listWithContent),
);


module.exports = postsRoutes;