export const healthChecker = async (req, res, next) => {
    try {
        return res.status(200).json({
            status: "success",
            message: "API is running"
        });
    } catch (error) {
        return next(error);
    }
}
