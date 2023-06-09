const multer = require('multer');
const path = require('path');

const dataStorage = multer.diskStorage({
  destination: './data',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const fileUpload = multer({
  storage: dataStorage,
  limits: {
    fileSize: 100000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    cb(undefined, true);
  },
});

module.exports = fileUpload;
