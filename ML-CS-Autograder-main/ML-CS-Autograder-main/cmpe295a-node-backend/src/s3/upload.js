const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require("dotenv").config();


const s3 = new aws.S3({
    // accessKeyId: process.env.S3_ACCESS_KEY,
    // secretAccessKey: process.env.S3_SECRET_KEY,
    // region: process.env.S3_BUCKET_REGION,
    accessKeyId: "AKIARPSPOJU3P7MI5V5C",
    secretAccessKey: "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",
    region: "us-west-1",
})

module.exports = multer({
  storage: multerS3({
      bucket: "auto-grading-tool-295a",
      s3: s3,
      acl: "public-read",
      key: function (req, file, cb) {
        cb(null, Math.floor(Math.random() * 999999) + "_" + file.originalname);
      }
    }),
});
