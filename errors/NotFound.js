const AbstractError = require('./AbstractError')

class NotFound extends AbstractError {
    constructor(status = '404', type='NOT_FOUND', message="Not Found") {
        super(message)
        this.status = status 
        this.message = message 
        this.type = type
    }
}

module.exports = NotFound