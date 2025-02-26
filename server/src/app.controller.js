import connectionDB from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
import { globalErrorHandler } from "./utils/errorHandling.js";

const bootstrap = async (app, express) => {
  // use json middleware for parsing request data
  app.use(express.json());
  
  // application routes
  app.use("/users", userRouter);
  
  // connect to database and wait until it's successful
  await connectionDB();

  // catch-all for undefined routes
  app.use("*", (req, res, next) => {
    return next(new Error(`${req.originalUrl} is an invalid URL`));
  });

  // global error handler
  app.use(globalErrorHandler);
};

export default bootstrap;
