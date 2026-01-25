import multer from "multer";

// only jpeg, jpg and png files are allowed
const fileFilter = (req, file, cb) => {
  console.log("file is : ", file);
  
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true); // accept file
  } else {
    cb(new Error("Only .jpeg, .jpg and .png files are allowed"), false);
  }
};

// multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
})

export { storage, fileFilter };
