import __dirname from "./index.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, `${__dirname}/../public/img`);
    } else if (file.fieldname === "documents") {
      cb(null, `${__dirname}/../public/documents`);
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({ storage });

export default uploader;
