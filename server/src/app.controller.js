import connectionDB from "./DB/connectionDB.js";
import applicationRouter from "./modules/applications/application.controller.js";
import chatRouter from "./modules/chats/chat.controller.js";
import companyRouter from "./modules/companies/company.controller.js";
import jobOpportunityRouter from "./modules/jobs/job.controller.js";
import userRouter from "./modules/users/user.controller.js";
import { graphqlMiddleware } from "../src/graphql/graphql.js";
import { globalErrorHandler } from "./utils/errorHandling.js";
import cors from "cors";

const bootstrap = async (app, express) => {

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  // use json middleware for parsing request data
  app.use(express.json());

  // application routes
  app.use("/users", userRouter);
  app.use("/companies", companyRouter);
  app.use("/jobs", jobOpportunityRouter);
  app.use("/applications", applicationRouter);
  app.use("/chats", chatRouter);

  app.use("/graphql", graphqlMiddleware);
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
