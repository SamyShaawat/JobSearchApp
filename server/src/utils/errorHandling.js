
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            return next(error);
        })
    }
}

export const globalErrorHandler = (err, req, res, next) => {
    return res.status(err.cause || 500).json({
        message: err.message,
        stack: err.stack
    });
};
