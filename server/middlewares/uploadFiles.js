// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, './uploads/');
//     },
//     filename: function(req, file, cb) {
//       cb(null, Date.now() + '.jpg');
//     }
//   });
  
// const fileFilter = (req, file, cb) => {
// // reject a file
// if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
// } else {
//     cb(null, false);
// }
// };

// const upload = multer({
// storage: storage,
// limits: {
//     fileSize: 1024 * 1024 * 5
// },
// fileFilter: fileFilter
// });

// const uploadFiles = upload.array('images', 4);

// module.exports = uploadFiles;


const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {      
    if (file.fieldname === "images") { 
      cb(null, './uploads/images');
    };
    if (file.fieldname === "videos")  { 
      cb(null, './uploads/videos');
    }
  },
    filename: function(req, file, cb) {
      if (file.fieldname === "images") { 
        cb(null, Date.now() + '.jpg');
      }; 
      if (file.fieldname === "videos") { 
        cb(null, Date.now() + '.mp4');
      }
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (file.fieldname === "images") { 
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) { 
        cb(null, true);
      } else {
        cb(null, false); 
      }
    };
    if (file.fieldname === "videos") { 
      if (
        file.mimetype === 'video/mp4' ||
        file.mimetype === 'video/gif' 
      ) { 
        cb(null, true);
      } else {
        cb(null, false); 
      }
    }
  };

const upload = multer({
storage: storage,
fileFilter: fileFilter
});

const uploadFiles = upload.fields(
  [
    { 
      name: 'images', 
      maxCount: 4,
    }, 
    { 
      name: 'videos', 
      maxCount: 1 
    }
  ]
)

module.exports = uploadFiles;