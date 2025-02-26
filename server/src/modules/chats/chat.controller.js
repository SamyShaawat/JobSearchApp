import { Router } from "express";
import { addChat } from "./chat.service.js";

const chatRouter = Router();

chatRouter.post('/addChat', addChat);

export default chatRouter;
