class ApiNotAvailable extends Error {
    constructor() {
        super()
        // this.status = 404
        this.type = 'API_NOT_AVAILABLE'
        this.message = 'Api Not Available'
        
    }

}

module.exports = ApiNotAvailable