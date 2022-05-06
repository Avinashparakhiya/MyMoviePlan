import mongoose from 'mongoose';
import 'dotenv/config' 


// connect to the mongoDB collection
const connectDB = () => {
	mongoose
		.connect("mongodb://localhost:27017/app_starting123", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		})
		.then((res) =>
			console.log(
				`MongoDB Connected: ${res.connection.host}`
			),
			console.log("===================================")
		)
		.catch((err) => {
			console.error(`Error: ${err.message}`);
			process.exit(1);
		});
};

export default connectDB;
