class AbstractError extends Error {
    constructor(status, message, type) {
        this.status = status
        this.message = message
        this.type = type
    }
}

module.exports = AbstractError