import { fraudService } from "../services/fraud.js";

/**
 * Get all fraud flags
 */
export const getAllFrauds = async (req, res, next) => {
    try {
        const frauds = await fraudService.getAllFlags();
        return res.status(200).json({
            status: "success",
            message: "Fraud list retrieved successfully",
            data: frauds,
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Get fraud flags by user ID
 */
export const getFraudByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const frauds = await fraudService.getFlagsByUser(userId);
        return res.status(200).json({
            status: "success",
            message: `Fraud flags for user ${userId} retrieved successfully`,
            data: frauds,
        });
    } catch (error) {
        return next(error);
    }
};
