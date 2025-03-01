import cron from "node-cron";
import userModel from "../DB/models/user.model.js";
// "0 0 */6 * * *"
cron.schedule("0 0 */6 * * *", async () => {
    console.log("CRON Job started: Deleting expired OTP codes...");
    try {
        const now = new Date();

        const result = await userModel.updateMany(
            {},
            {
                $pull: {
                    OTP: { expiresIn: { $lt: now } }
                }
            }
        );
        console.log(result);


        console.log(
            `CRON Job completed: ${result.modifiedCount} user documents updated.`
        );
    } catch (error) {
        console.error("Error during CRON job (delete expired OTP):", error);
    }
});
