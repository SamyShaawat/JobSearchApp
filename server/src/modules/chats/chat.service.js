import chatModel from '../../DB/models/chat.model.js';
import { asyncHandler } from '../../utils/errorHandling.js';

export const addChat = asyncHandler(async (req, res, next) => {
    const { senderId, receiverId, messages } = req.body;

    // Build chat data object
    const chatData = {
        senderId,
        receiverId,
        messages
    };

    // Create a new chat document in the database
    const newChat = await chatModel.create(chatData);

    return res.status(201).json({
        message: "Chat created successfully",
        data: newChat
    });
});
