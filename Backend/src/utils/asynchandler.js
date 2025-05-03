const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.then(requestHandler(req, res, next)).catch((err) => next(err))
    }
}
export {asyncHandler}