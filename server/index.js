import dotenv from "dotenv";
import express from 'express';
import bootstrap from './src/app.controller.js';
import path from "path";

dotenv.config({ path: path.resolve("config/.env") })
const port = process.env.PORT || 3000;

// console.log(process.env.PORT);


const app = express();

bootstrap(app, express);

app.listen(port, () => {
  console.log(`listening on port ${port}`);

})