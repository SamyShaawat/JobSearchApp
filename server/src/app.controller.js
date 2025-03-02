import connectionDB from "./DB/connectionDB.js";
import applicationRouter from "./modules/applications/application.controller.js";
import chatRouter from "./modules/chats/chat.controller.js";
import companyRouter from "./modules/companies/company.controller.js";
import jobOpportunityRouter from "./modules/jobs/job.controller.js";
import userRouter from "./modules/users/user.controller.js";
import { graphqlMiddleware } from "../src/graphql/graphql.js";
import { globalErrorHandler } from "./utils/errorHandling.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const bootstrap = async (app, express) => {
  // Use Helmet 
  app.use(helmet());

  // Rate-limit
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,                
    message: "Too many requests, please try again later."
  });
  app.use(limiter);

  // CORS config
  app.use(
    cors({
      origin: "http://localhost:5173", // your front-end origin
      credentials: true,
    })
  );

  // Parse JSON bodies
  app.use(express.json());

  // Application routes
  app.use("/users", userRouter);
  app.use("/companies", companyRouter);
  app.use("/jobs", jobOpportunityRouter);
  app.use("/applications", applicationRouter);
  app.use("/chats", chatRouter);

  // GraphQL endpoint
  app.use("/graphql", graphqlMiddleware);

  // Connect to the database
  await connectionDB();

  // Catch-all for undefined routes
  app.use("*", (req, res, next) => {
    return next(new Error(`${req.originalUrl} is an invalid URL`));
  });

  // Global error handler
  app.use(globalErrorHandler);
};

export default bootstrap;