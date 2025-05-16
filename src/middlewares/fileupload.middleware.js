import multer, { diskStorage } from "multer";

const storageConfig = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + file.originalname;
    cb(null, fileName);
  },
});

// export as well as created multer instance
export const uploadFile = multer({ storage: storageConfig });

// we will append current date and time stamp to filename
// to make unique names before storing.
