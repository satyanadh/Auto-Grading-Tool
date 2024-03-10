const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require("dotenv").config();


const s3 = new aws.S3({
    //accessKeyId: process.env.S3_ACCESS_KEY,
    //secretAccessKey: process.env.S3_SECRET_KEY,
    //region: process.env.S3_BUCKET_REGION,
    accessKeyId: "AKIARPSPOJU3P7MI5V5C",
    secretAccessKey: "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",
    region: "us-west-1",
})

const uploadFile = () => multer({
  storage: multerS3({
      bucket: "auto-grading-tool-295a",
      s3: s3,
      acl: "public-read",
      key: function (req, file, cb) {
        cb(null, file.originalname);
      }
    }),
});

exports.upload = (req, res, next) => {
    
    const uploadSingle = uploadFile().single('fileUpload');

    uploadSingle(req, res, err => {

        console.log(req.file);

        if(err){
            console.log(err);
            return res.status(400).send(err);
        }
        else {
            console.log(req.file.location);
            res.status(200).json({data: req.file, location: req.file.location});
        }    
           
    })
}