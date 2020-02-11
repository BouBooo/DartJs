class InvalidFormat extends Error {
    constructor() {
        super()
        // this.status = 400
        this.type = 'INVALID_FORMAT'
        this.message = 'Invalid field or missing fields'
        
    }

}

module.exports = InvalidFormat