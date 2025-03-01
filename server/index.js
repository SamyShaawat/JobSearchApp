import dotenv from "dotenv";
import express from "express";
import bootstrap from "./src/app.controller.js";
import path from "path";

dotenv.config({ path: path.resolve("config/.env") });
import "./src/scheduler/schedule.js";

const port = process.env.PORT || 3000;
const app = express();

(async () => {
  await bootstrap(app, express);
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
})();
