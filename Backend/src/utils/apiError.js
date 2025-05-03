class apiError extends Error {
    constructor(
        message = "Something went wrong",
        statusCode,
        stack = "",
        errors = []
    ) {
        super(message)
        this.data = null
        this.statusCode = statusCode
        this.errors = errors
        this.message = message
        this.success = false

        if (stack)
            this.stack = stack
        else
            Error.captureStackTrace(this, this.constructor)

    }
}

export { apiError }