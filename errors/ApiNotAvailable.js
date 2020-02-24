class ApiNotAvailable extends Error {
    constructor() {
        super()
        this.type = 'API_NOT_AVAILABLE'
        this.message = 'Api Not Available'
        
    }

}

module.exports = ApiNotAvailable