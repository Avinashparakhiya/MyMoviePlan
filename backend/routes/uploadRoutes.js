import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
const router = express.Router();
import fs from 'fs';

// Create a new instance of the S3 bucket object with the correct user credentials
// const s3 = new aws.S3({
// 	accessKeyId: process.env.S3_ACCESS_KEY_ID,
// 	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
// 	Bucket: 'MyMoviePlanbucket',
// });

// Setup the congifuration needed to use multer
var dir = './uploads';

var upload = multer({
	storage: multer.diskStorage({
  
	  destination: function (req, file, callback) {
		if (!fs.existsSync(dir)) {
		  fs.mkdirSync(dir);
		}
		callback(null, './uploads');
	  },
	  filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }
  
	}),
  
	fileFilter: function (req, file, callback) {
	  var ext = path.extname(file.originalname)
	  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
		return callback(/*res.end('Only images are allowed')*/ null, false)
	  }
	  callback(null, true)
	},
  });

router.post('/', upload.single('image'), (req, res) => {
	if (req.file) res.send(req.file.location);
	else {
		res.status(401);
		throw new Error('Invalid file type');
	}
});

export default router;
