const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const indexRoute = require('./src/routes')
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/', indexRoute);

const port = process.env.PORT || 5000;
const server = http.createServer(app);

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URL).then(() => {
   console.log("Mongodb connected");
   server.listen(port, () => {
      console.log(`Server is listening on port: ${port}`)
   });
}).catch(err => {
   console.log({ err });
   process.exit(1);
});